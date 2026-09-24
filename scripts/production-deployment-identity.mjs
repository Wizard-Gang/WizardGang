import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function requireVersionId(value, label) {
  const versionId = typeof value === "string" ? value.trim() : "";
  if (!VERSION_ID_PATTERN.test(versionId)) throw new Error(`${label} must be a Cloudflare Worker Version ID`);
  return versionId;
}

export function extractDeployedVersionId(output) {
  let versionId = "";
  for (const raw of String(output ?? "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      continue;
    }
    if (record?.type === "deploy" && typeof record.version_id === "string") {
      versionId = record.version_id;
    }
  }
  return requireVersionId(versionId, "Wrangler deploy output version_id");
}

export function verifyServingDeployment(deployments, expectedVersionId) {
  const versionId = requireVersionId(expectedVersionId, "Expected deployed version");
  if (!Array.isArray(deployments) || deployments.length === 0) {
    throw new Error("Cloudflare returned no production deployments");
  }

  const latest = deployments.at(-1);
  if (!latest || !Array.isArray(latest.versions) || latest.versions.length !== 1) {
    throw new Error("Latest production deployment must route 100% of traffic to exactly one version");
  }

  const [traffic] = latest.versions;
  if (traffic?.version_id !== versionId) {
    throw new Error(`Latest production deployment serves ${traffic?.version_id || "no version"}; expected ${versionId}`);
  }
  if (Number(traffic.percentage) !== 100) {
    throw new Error(`Production version ${versionId} is serving ${traffic.percentage ?? "unknown"}%; expected 100%`);
  }
  return latest;
}

export function verifyPublicReleaseIdentity(payload, { release, commit }) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Public version endpoint did not return an object");
  }
  if (payload.release !== release) {
    throw new Error(`Public release ${payload.release ?? "missing"} does not match ${release}`);
  }
  if (payload.commit !== commit) {
    throw new Error(`Public commit ${payload.commit ?? "missing"} does not match ${commit}`);
  }
  return payload;
}

export async function fetchPublicReleaseIdentity({
  url,
  release,
  commit,
  fetchImpl = fetch,
  attempts = 24,
  retryDelayMs = 5_000,
  sleep = (milliseconds) => new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds)),
}) {
  let lastFailure = "no response";
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers: { accept: "application/json" },
        redirect: "error",
      });
      const body = await response.text();
      if (!response.ok) {
        lastFailure = `HTTP ${response.status}`;
      } else {
        try {
          const payload = JSON.parse(body);
          return verifyPublicReleaseIdentity(payload, { release, commit });
        } catch (error) {
          lastFailure = error instanceof Error ? error.message : String(error);
        }
      }
    } catch (error) {
      lastFailure = error instanceof Error ? error.message : String(error);
    }

    if (attempt < attempts) await sleep(retryDelayMs);
  }
  throw new Error(`Public release identity did not converge after ${attempts} attempts: ${lastFailure}`);
}

function readJson(path, label) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
  return parsed;
}

async function main(args) {
  const [command, ...rest] = args;
  if (command === "deployed-version") {
    const [outputFile] = rest;
    if (!outputFile) throw new Error("deployed-version requires the Wrangler output file");
    process.stdout.write(`${extractDeployedVersionId(readFileSync(outputFile, "utf8"))}\n`);
    return;
  }
  if (command === "provider") {
    const [deploymentsFile, expectedVersionId] = rest;
    if (!deploymentsFile || !expectedVersionId) throw new Error("provider requires deployments JSON and expected Version ID");
    const latest = verifyServingDeployment(readJson(deploymentsFile, "Cloudflare deployments output"), expectedVersionId);
    console.log(`Cloudflare production serves ${expectedVersionId} at 100% in deployment ${latest.id ?? "unknown"}.`);
    return;
  }
  if (command === "public") {
    const [url, release, commit] = rest;
    if (!url || !release || !commit) throw new Error("public requires URL, release, and commit");
    await fetchPublicReleaseIdentity({ url, release, commit });
    console.log(`Public production identity matches ${release} at ${commit}.`);
    return;
  }
  throw new Error(`unknown production deployment identity command: ${command || "(missing)"}`);
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    await main(process.argv.slice(2));
  } catch (error) {
    console.error(`production deployment identity verification failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

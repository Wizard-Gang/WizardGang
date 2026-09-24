import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateReleaseIdentity } from "./release-identity.mjs";

function defaultRunGh(args, { cwd }) {
  const result = spawnSync("gh", args, { cwd, encoding: "utf8", env: process.env });
  return {
    status: result.status ?? 1,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
  };
}

function assertReleaseRecord(stdout, tag) {
  let record;
  try {
    record = JSON.parse(stdout);
  } catch {
    throw new Error(`GitHub Release response for ${tag} is not valid JSON`);
  }
  if (record.tagName !== tag) throw new Error(`GitHub Release tag ${record.tagName || "(empty)"} does not match ${tag}`);
  if (record.isDraft !== false) throw new Error(`GitHub Release must be published, not draft: ${tag}`);
  if (record.isPrerelease !== false) throw new Error(`GitHub Release must not be prerelease: ${tag}`);
  return record;
}

export function reconcileGitHubRelease({
  cwd = process.cwd(),
  tag,
  repo = process.env.GITHUB_REPOSITORY,
  runGh = defaultRunGh,
} = {}) {
  const failures = validateReleaseIdentity({ cwd, release: tag });
  if (failures.length) throw new Error(`release identity invalid: ${failures.join("; ")}`);
  if (typeof repo !== "string" || !/^[^/\s]+\/[^/\s]+$/.test(repo)) {
    throw new Error(`GITHUB_REPOSITORY must be owner/name: ${repo || "(empty)"}`);
  }

  const viewArgs = ["release", "view", tag, "--repo", repo, "--json", "tagName,isDraft,isPrerelease"];
  const existing = runGh(viewArgs, { cwd });
  if (existing.status === 0) {
    assertReleaseRecord(existing.stdout, tag);
    return { created: false, tag };
  }

  const createArgs = [
    "release", "create", tag,
    "--repo", repo,
    "--verify-tag",
    "--title", tag,
    "--generate-notes",
  ];
  const created = runGh(createArgs, { cwd });
  const verified = runGh(viewArgs, { cwd });
  if (verified.status !== 0) {
    const detail = created.stderr || verified.stderr || "unable to verify provider state";
    throw new Error(`GitHub Release reconciliation failed for ${tag}: ${detail}`);
  }
  assertReleaseRecord(verified.stdout, tag);
  return { created: created.status === 0, tag };
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    const tag = process.argv[2] || process.env.RELEASE || "";
    const result = reconcileGitHubRelease({ tag });
    console.log(result.created ? `Published GitHub Release ${result.tag}.` : `GitHub Release already matches immutable tag ${result.tag}.`);
  } catch (error) {
    console.error(`release publication failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const RELEASE_PATTERN = /^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/;

export function isSemanticReleaseTag(value) {
  return typeof value === "string" && RELEASE_PATTERN.test(value);
}

function git(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  return { status: result.status ?? 1, stdout: (result.stdout ?? "").trim() };
}

export function validateReleaseIdentity({ cwd = process.cwd(), release } = {}) {
  const failures = [];
  const value = typeof release === "string" ? release.trim() : "";
  if (!isSemanticReleaseTag(value)) {
    return [`release identity must match semantic vMAJOR.MINOR.PATCH: ${value || "(empty)"}`];
  }

  let packageVersion = "";
  try {
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
    packageVersion = typeof pkg.version === "string" ? pkg.version.trim() : "";
  } catch {
    failures.push("unable to read root package.json version");
  }
  if (!packageVersion) failures.push("root package.json version must be a non-empty string");
  else if (value !== `v${packageVersion}`) failures.push(`package.json version ${packageVersion} does not match release ${value}`);

  const ref = `refs/tags/${value}`;
  const type = git(cwd, ["cat-file", "-t", ref]);
  if (type.status !== 0) failures.push(`release tag does not exist locally: ${value}`);
  else if (type.stdout !== "tag") failures.push(`release tag must be annotated: ${value}`);

  if (type.status === 0 && type.stdout === "tag") {
    const tagged = git(cwd, ["rev-parse", `${ref}^{commit}`]);
    const head = git(cwd, ["rev-parse", "HEAD"]);
    if (tagged.status !== 0) failures.push(`release tag does not resolve to a commit: ${value}`);
    if (head.status !== 0) failures.push("unable to resolve checked-out HEAD");
    if (tagged.status === 0 && head.status === 0 && tagged.stdout !== head.stdout) {
      failures.push(`release tag ${value} does not point at checked-out HEAD`);
    }
  }
  return failures;
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const release = process.argv[2] || process.env.RELEASE || "";
  const failures = validateReleaseIdentity({ release });
  if (failures.length) {
    for (const failure of failures) console.error(`FAIL ${failure}`);
    process.exitCode = 1;
  } else {
    const head = git(process.cwd(), ["rev-parse", "HEAD"]).stdout;
    console.log(`Release identity verified: ${release} @ ${head}`);
  }
}

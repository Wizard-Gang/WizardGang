import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isSemanticReleaseTag, validateReleaseIdentity } from "./release-identity.mjs";

export const DEVELOPMENT_RELEASE = "0.0.0-dev";

function git(cwd, ...args) {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function packageVersion(cwd) {
  try {
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
    return typeof pkg.version === "string" ? pkg.version.trim() : "";
  } catch {
    return "";
  }
}

function exactAnnotatedRelease(cwd, version) {
  if (!version) return "";
  const expected = `v${version}`;
  if (!isSemanticReleaseTag(expected)) return "";
  const tags = git(cwd, "tag", "--points-at", "HEAD", "--sort=-version:refname")
    .split("\n")
    .filter(Boolean);
  if (!tags.includes(expected)) return "";
  return git(cwd, "cat-file", "-t", `refs/tags/${expected}`) === "tag" ? expected : "";
}

export function createBuildIdentity({ cwd = process.cwd(), product = "WizardGang", release } = {}) {
  const commit = git(cwd, "rev-parse", "HEAD");
  const requestedRelease = typeof release === "string"
    ? release.trim()
    : (process.env.RELEASE || "").trim();

  if (!commit) {
    if (requestedRelease) throw new Error("release build requires a Git checkout");
    return {
      product,
      release: DEVELOPMENT_RELEASE,
      commit: "development",
      builtAt: new Date().toISOString(),
    };
  }

  const version = packageVersion(cwd);
  let releaseIdentity = exactAnnotatedRelease(cwd, version) || DEVELOPMENT_RELEASE;
  if (requestedRelease) {
    const failures = validateReleaseIdentity({ cwd, release: requestedRelease });
    if (failures.length) throw new Error(`release build identity is invalid:\n${failures.join("\n")}`);
    releaseIdentity = requestedRelease;
  }

  const dirty = git(cwd, "status", "--porcelain") !== "";
  if (requestedRelease && dirty) throw new Error(`release build ${releaseIdentity} requires a clean checkout`);
  if (dirty) releaseIdentity = `${releaseIdentity}+dirty`;

  const commitEpoch = git(cwd, "show", "-s", "--format=%ct", "HEAD");
  if (!/^\d+$/.test(commitEpoch)) throw new Error("unable to resolve commit build time");

  return {
    product,
    release: releaseIdentity,
    commit,
    builtAt: new Date(Number(commitEpoch) * 1000).toISOString(),
  };
}

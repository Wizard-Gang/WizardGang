import { spawnSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function git(cwd, args, { allowFailure = false } = {}) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  const status = result.status ?? 1;
  const stdout = (result.stdout ?? "").trim();
  const stderr = (result.stderr ?? "").trim();
  if (status !== 0 && !allowFailure) {
    throw new Error(stderr || `git ${args.join(" ")} failed with status ${status}`);
  }
  return { status, stdout, stderr };
}

function exactSemver(value, label) {
  const text = typeof value === "string" ? value.trim() : "";
  const match = VERSION_PATTERN.exec(text);
  if (!match) throw new Error(`${label} must be exact MAJOR.MINOR.PATCH: ${text || "(empty)"}`);
  return { text, parts: match.slice(1).map((part) => BigInt(part)) };
}

function compareSemver(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left.parts[index] > right.parts[index]) return 1;
    if (left.parts[index] < right.parts[index]) return -1;
  }
  return 0;
}

function readJsonAt(cwd, ref, path) {
  const shown = git(cwd, ["show", `${ref}:${path}`]);
  try {
    return JSON.parse(shown.stdout);
  } catch {
    throw new Error(`${path} at ${ref} is not valid JSON`);
  }
}

function versionAt(cwd, ref) {
  const pkg = readJsonAt(cwd, ref, "package.json");
  const lock = readJsonAt(cwd, ref, "package-lock.json");
  const packageVersion = exactSemver(pkg.version, `package.json version at ${ref}`);
  const lockVersion = exactSemver(lock.version, `package-lock.json version at ${ref}`);
  const rootLockVersion = exactSemver(lock.packages?.[""]?.version, `package-lock root version at ${ref}`);

  if (packageVersion.text !== lockVersion.text || packageVersion.text !== rootLockVersion.text) {
    throw new Error(`package and lockfile versions disagree at ${ref}`);
  }
  return packageVersion;
}

function resolveCommit(cwd, ref, label) {
  const resolved = git(cwd, ["rev-parse", "--verify", `${ref}^{commit}`]);
  if (!resolved.stdout) throw new Error(`unable to resolve ${label}`);
  return resolved.stdout;
}

function remoteTagState(cwd, tag) {
  const ref = `refs/tags/${tag}`;
  const result = git(cwd, ["ls-remote", "--tags", "origin", ref, `${ref}^{}`]);
  if (!result.stdout) return { exists: false, annotated: false, target: "" };

  let direct = "";
  let peeled = "";
  for (const line of result.stdout.split("\n")) {
    const [sha, name] = line.split(/\s+/);
    if (name === ref) direct = sha;
    if (name === `${ref}^{}`) peeled = sha;
  }
  if (!direct) throw new Error(`remote tag lookup returned no direct ref for ${tag}`);
  return { exists: true, annotated: Boolean(peeled), target: peeled || direct };
}

function localTagState(cwd, tag) {
  const ref = `refs/tags/${tag}`;
  const type = git(cwd, ["cat-file", "-t", ref], { allowFailure: true });
  if (type.status !== 0) return { exists: false, annotated: false, target: "" };
  const target = git(cwd, ["rev-parse", `${ref}^{commit}`]).stdout;
  return { exists: true, annotated: type.stdout === "tag", target };
}

function assertTagState(state, tag, after, location) {
  if (!state.annotated) throw new Error(`${location} release tag must be annotated: ${tag}`);
  if (state.target !== after) {
    throw new Error(`${location} release tag ${tag} points to ${state.target}, expected ${after}`);
  }
}

export function reconcileReleaseTag({ cwd = process.cwd(), before, after, pushOrigin = false } = {}) {
  const beforeCommit = resolveCommit(cwd, before, "before commit");
  const afterCommit = resolveCommit(cwd, after, "after commit");
  const headCommit = resolveCommit(cwd, "HEAD", "checked-out HEAD");
  if (afterCommit !== headCommit) {
    throw new Error(`after commit ${afterCommit} is not checked-out HEAD ${headCommit}`);
  }

  const parent = resolveCommit(cwd, `${afterCommit}^`, "after commit parent");
  if (parent !== beforeCommit) {
    throw new Error(`before commit ${beforeCommit} is not the direct parent of ${afterCommit}`);
  }

  const previous = versionAt(cwd, beforeCommit);
  const current = versionAt(cwd, afterCommit);
  if (previous.text === current.text) {
    return { changed: false, tag: "", target: afterCommit, existing: false };
  }
  if (compareSemver(current, previous) <= 0) {
    throw new Error(`release version must increase from ${previous.text} to ${current.text}`);
  }

  const tag = `v${current.text}`;
  const remote = remoteTagState(cwd, tag);
  if (remote.exists) {
    assertTagState(remote, tag, afterCommit, "remote");
    return { changed: true, tag, target: afterCommit, existing: true };
  }

  const local = localTagState(cwd, tag);
  if (local.exists) {
    assertTagState(local, tag, afterCommit, "local");
  } else {
    git(cwd, [
      "-c", "user.name=github-actions[bot]",
      "-c", "user.email=41898282+github-actions[bot]@users.noreply.github.com",
      "tag", "-a", tag, afterCommit, "-m", `Release ${tag}`,
    ]);
  }

  if (pushOrigin) {
    git(cwd, ["push", "origin", `refs/tags/${tag}`]);
    const published = remoteTagState(cwd, tag);
    if (!published.exists) throw new Error(`release tag was not published: ${tag}`);
    assertTagState(published, tag, afterCommit, "remote");
  }

  return { changed: true, tag, target: afterCommit, existing: false };
}

export function writeGitHubOutput(result, outputPath = process.env.GITHUB_OUTPUT) {
  if (!outputPath) return;
  const tag = result?.changed ? result.tag : "";
  appendFileSync(outputPath, `tag=${tag}\n`, "utf8");
}

function parseArgs(args) {
  const options = { before: "", after: "", pushOrigin: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--push-origin") {
      options.pushOrigin = true;
      continue;
    }
    if (arg === "--before" || arg === "--after") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      index += 1;
      if (arg === "--before") options.before = value;
      else options.after = value;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }
  if (!options.before) throw new Error("--before is required");
  if (!options.after) throw new Error("--after is required");
  return options;
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  try {
    const result = reconcileReleaseTag(parseArgs(process.argv.slice(2)));
    writeGitHubOutput(result);
    if (!result.changed) console.log(`No package release version change at ${result.target}; no tag created.`);
    else if (result.existing) console.log(`Release tag already matches ${result.target}: ${result.tag}`);
    else console.log(`Created immutable release tag ${result.tag} at ${result.target}${process.argv.includes("--push-origin") ? " and pushed to origin" : ""}.`);
  } catch (error) {
    console.error(`release tag reconciliation failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

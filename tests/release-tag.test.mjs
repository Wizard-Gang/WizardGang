import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { reconcileReleaseTag } from "../scripts/release-tag.mjs";

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function writeVersion(cwd, version, lockVersion = version) {
  writeFileSync(join(cwd, "package.json"), `${JSON.stringify({ name: "fixture", version }, null, 2)}\n`);
  writeFileSync(join(cwd, "package-lock.json"), `${JSON.stringify({ name: "fixture", version: lockVersion, lockfileVersion: 3, packages: { "": { name: "fixture", version: lockVersion } } }, null, 2)}\n`);
}

function fixture(from = "1.0.0", to = "1.1.0") {
  const root = mkdtempSync(join(tmpdir(), "wizardgang-release-tag-"));
  const origin = join(root, "origin.git");
  const cwd = join(root, "work");
  git(root, "init", "--bare", "-q", origin);
  git(root, "init", "-q", cwd);
  git(cwd, "config", "user.name", "Release Tag Fixture");
  git(cwd, "config", "user.email", "release-tag@example.invalid");
  git(cwd, "remote", "add", "origin", origin);
  writeVersion(cwd, from);
  writeFileSync(join(cwd, "source.txt"), "one\n");
  git(cwd, "add", ".");
  git(cwd, "commit", "-q", "-m", "before");
  const before = git(cwd, "rev-parse", "HEAD");
  writeVersion(cwd, to);
  writeFileSync(join(cwd, "source.txt"), "two\n");
  git(cwd, "add", ".");
  git(cwd, "commit", "-q", "-m", "after");
  const after = git(cwd, "rev-parse", "HEAD");
  git(cwd, "push", "-q", "origin", "HEAD:main");
  return { root, cwd, origin, before, after };
}

function cleanup(root) {
  rmSync(root, { recursive: true, force: true });
}

test("ordinary main commit with no version change creates no tag", () => {
  const f = fixture("1.0.0", "1.0.0");
  try {
    const result = reconcileReleaseTag({ cwd: f.cwd, before: f.before, after: f.after, pushOrigin: true });
    assert.deepEqual(result, { changed: false, tag: "", target: f.after, existing: false });
    assert.equal(git(f.cwd, "ls-remote", "--tags", "origin"), "");
  } finally {
    cleanup(f.root);
  }
});

test("forward version change creates one annotated tag at the exact merged commit", () => {
  const f = fixture();
  try {
    const first = reconcileReleaseTag({ cwd: f.cwd, before: f.before, after: f.after, pushOrigin: true });
    assert.equal(first.tag, "v1.1.0");
    assert.equal(first.existing, false);
    assert.equal(git(f.cwd, "cat-file", "-t", "refs/tags/v1.1.0"), "tag");
    assert.equal(git(f.cwd, "rev-parse", "refs/tags/v1.1.0^{commit}"), f.after);

    const remote = git(f.cwd, "ls-remote", "--tags", "origin", "refs/tags/v1.1.0", "refs/tags/v1.1.0^{}");
    assert.match(remote, new RegExp(`${f.after}\\s+refs/tags/v1\\.1\\.0\\^\\{\\}`));

    const second = reconcileReleaseTag({ cwd: f.cwd, before: f.before, after: f.after, pushOrigin: true });
    assert.equal(second.existing, true);
    assert.equal(second.tag, "v1.1.0");
  } finally {
    cleanup(f.root);
  }
});

test("existing lightweight or wrong-target remote tag fails closed", () => {
  const lightweight = fixture();
  try {
    git(lightweight.cwd, "tag", "v1.1.0", lightweight.after);
    git(lightweight.cwd, "push", "-q", "origin", "refs/tags/v1.1.0");
    assert.throws(
      () => reconcileReleaseTag({ cwd: lightweight.cwd, before: lightweight.before, after: lightweight.after, pushOrigin: true }),
      /must be annotated/,
    );
  } finally {
    cleanup(lightweight.root);
  }

  const wrong = fixture();
  try {
    git(wrong.cwd, "tag", "-a", "v1.1.0", wrong.before, "-m", "wrong target");
    git(wrong.cwd, "push", "-q", "origin", "refs/tags/v1.1.0");
    assert.throws(
      () => reconcileReleaseTag({ cwd: wrong.cwd, before: wrong.before, after: wrong.after, pushOrigin: true }),
      /points to .* expected/,
    );
  } finally {
    cleanup(wrong.root);
  }
});

test("downgrades and package-lock drift cannot create a release tag", () => {
  const downgrade = fixture("1.1.0", "1.0.0");
  try {
    assert.throws(
      () => reconcileReleaseTag({ cwd: downgrade.cwd, before: downgrade.before, after: downgrade.after }),
      /must increase/,
    );
  } finally {
    cleanup(downgrade.root);
  }

  const drift = fixture();
  try {
    writeVersion(drift.cwd, "1.1.0", "1.0.0");
    git(drift.cwd, "add", "package.json", "package-lock.json");
    git(drift.cwd, "commit", "-q", "--amend", "--no-edit");
    const after = git(drift.cwd, "rev-parse", "HEAD");
    assert.throws(
      () => reconcileReleaseTag({ cwd: drift.cwd, before: drift.before, after }),
      /versions disagree/,
    );
  } finally {
    cleanup(drift.root);
  }
});

function jobBlock(workflow, jobName) {
  const start = new RegExp(`^  ${jobName}:\\s*$`, "m").exec(workflow);
  if (!start) return "";
  const after = workflow.slice(start.index + start[0].length);
  const next = /^  [A-Za-z0-9_-]+:\s*$/m.exec(after);
  return next ? after.slice(0, next.index) : after;
}

test("canonical CI tags only successful merged main and keeps publication/deploy out of WG-086", () => {
  const workflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
  const block = jobBlock(workflow, "release-tag");
  assert.ok(block, "CI must define release-tag job");
  assert.match(block, /^    needs: verify$/m);
  assert.match(block, /^    if: github\.event_name == 'push'$/m);
  assert.match(block, /^      contents: write$/m);
  assert.match(block, /fetch-depth: 0/);
  assert.match(block, /node-version-file: \.node-version/);
  assert.match(block, /node scripts\/release-tag\.mjs --before "\$\{\{ github\.event\.before \}\}" --after "\$GITHUB_SHA" --push-origin/);
  assert.doesNotMatch(block, /gh release|deploy:production|wrangler deploy/);
});

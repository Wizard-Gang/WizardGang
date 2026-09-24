import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { reconcileGitHubRelease } from "../scripts/release-publication.mjs";

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function fixture(version = "1.2.3") {
  const cwd = mkdtempSync(join(tmpdir(), "wizardgang-release-publication-"));
  git(cwd, "init", "-q");
  git(cwd, "config", "user.name", "Release Publication Fixture");
  git(cwd, "config", "user.email", "release-publication@example.invalid");
  writeFileSync(join(cwd, "package.json"), `${JSON.stringify({ version }, null, 2)}\n`);
  writeFileSync(join(cwd, "source.txt"), "one\n");
  git(cwd, "add", ".");
  git(cwd, "commit", "-q", "-m", "fixture");
  git(cwd, "tag", "-a", `v${version}`, "-m", `v${version}`);
  return cwd;
}

function cleanup(cwd) {
  rmSync(cwd, { recursive: true, force: true });
}

function published(tag = "v1.2.3") {
  return { status: 0, stdout: JSON.stringify({ tagName: tag, isDraft: false, isPrerelease: false }), stderr: "" };
}

test("matching existing GitHub Release is verified without rewrite", () => {
  const cwd = fixture();
  const calls = [];
  try {
    const result = reconcileGitHubRelease({
      cwd, tag: "v1.2.3", repo: "Wizard-Gang/WizardGang",
      runGh(args) { calls.push(args); return published(); },
    });
    assert.deepEqual(result, { created: false, tag: "v1.2.3" });
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0].slice(0, 3), ["release", "view", "v1.2.3"]);
  } finally {
    cleanup(cwd);
  }
});

test("missing release is created with verify-tag and re-read from provider state", () => {
  const cwd = fixture();
  const calls = [];
  try {
    const result = reconcileGitHubRelease({
      cwd, tag: "v1.2.3", repo: "Wizard-Gang/WizardGang",
      runGh(args) {
        calls.push(args);
        if (calls.length === 1) return { status: 1, stdout: "", stderr: "release not found" };
        if (args[1] === "create") return { status: 0, stdout: "", stderr: "" };
        return published();
      },
    });
    assert.deepEqual(result, { created: true, tag: "v1.2.3" });
    const create = calls.find((args) => args[1] === "create");
    assert.ok(create, "release create must run after an absent release");
    assert.ok(create.includes("--verify-tag"), "release creation must verify the existing remote tag");
    assert.ok(create.includes("--generate-notes"), "release creation must be non-interactive");
    assert.deepEqual(calls.at(-1).slice(0, 3), ["release", "view", "v1.2.3"]);
  } finally {
    cleanup(cwd);
  }
});

test("provider mismatch and invalid local release identity fail closed", () => {
  const cwd = fixture();
  try {
    assert.throws(
      () => reconcileGitHubRelease({
        cwd, tag: "v1.2.3", repo: "Wizard-Gang/WizardGang",
        runGh() { return published("v9.9.9"); },
      }),
      /does not match/,
    );
    assert.throws(
      () => reconcileGitHubRelease({ cwd, tag: "v1.2.4", repo: "Wizard-Gang/WizardGang", runGh() { throw new Error("must not run"); } }),
      /release identity invalid/,
    );
  } finally {
    cleanup(cwd);
  }
});

function jobBlock(workflow, jobName) {
  const start = new RegExp(`^  ${jobName}:\\s*$`, "m").exec(workflow);
  if (!start) return "";
  const after = workflow.slice(start.index + start[0].length);
  const next = /^  [A-Za-z0-9_-]+:\s*$/m.exec(after);
  return next ? after.slice(0, next.index) : after;
}

test("canonical release publication reproduces the exact tag before GitHub Release creation", () => {
  const workflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
  const block = jobBlock(workflow, "release-publish");
  assert.ok(block, "CI must define release-publish job");
  assert.match(block, /^    needs: release-tag$/m);
  assert.match(block, /^    if: github\.event_name == 'push' && needs\.release-tag\.outputs\.tag != ''$/m);
  assert.match(block, /^      contents: write$/m);
  assert.match(block, /ref: refs\/tags\/\$\{\{ needs\.release-tag\.outputs\.tag \}\}/);
  assert.match(block, /fetch-depth: 0/);
  assert.match(block, /node-version-file: \.node-version/);
  assert.match(block, /npm install --global npm@11\.19\.1/);
  assert.match(block, /run: npm ci/);
  assert.match(block, /run: npm run check/);
  assert.match(block, /npm run verify:release-identity -- "\$RELEASE_TAG"/);
  assert.match(block, /node scripts\/release-publication\.mjs "\$RELEASE_TAG"/);
  assert.doesNotMatch(block, /deploy:production|wrangler deploy/);
});

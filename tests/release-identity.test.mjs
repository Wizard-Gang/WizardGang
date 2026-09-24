import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createBuildIdentity, DEVELOPMENT_RELEASE } from "../scripts/build-identity.mjs";
import { validateReleaseIdentity } from "../scripts/release-identity.mjs";

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function fixture(version = "1.2.3") {
  const cwd = mkdtempSync(join(tmpdir(), "wizardgang-release-identity-"));
  git(cwd, "init", "-q");
  git(cwd, "config", "user.name", "Release Identity Fixture");
  git(cwd, "config", "user.email", "release-identity@example.invalid");
  writeFileSync(join(cwd, ".gitignore"), "dist/\n");
  writeFileSync(join(cwd, "package.json"), `${JSON.stringify({ version }, null, 2)}\n`);
  writeFileSync(join(cwd, "source.txt"), "one\n");
  git(cwd, "add", ".gitignore", "package.json", "source.txt");
  git(cwd, "commit", "-q", "-m", "fixture");
  return cwd;
}

function cleanup(cwd) {
  rmSync(cwd, { recursive: true, force: true });
}

test("annotated semantic tag matching package version and HEAD is a release identity", () => {
  const cwd = fixture();
  try {
    git(cwd, "tag", "-a", "v1.2.3", "-m", "v1.2.3");
    assert.deepEqual(validateReleaseIdentity({ cwd, release: "v1.2.3" }), []);

    const identity = createBuildIdentity({ cwd, product: "WizardGang" });
    assert.equal(identity.release, "v1.2.3");
    assert.equal(identity.commit, git(cwd, "rev-parse", "HEAD"));

    writeFileSync(join(cwd, "source.txt"), "dirty\n");
    assert.equal(createBuildIdentity({ cwd }).release, "v1.2.3+dirty");
    assert.throws(() => createBuildIdentity({ cwd, release: "v1.2.3" }), /requires a clean checkout/);
  } finally {
    cleanup(cwd);
  }
});

test("ordinary clean and dirty builds remain explicit development identities", () => {
  const cwd = fixture();
  try {
    const clean = createBuildIdentity({ cwd });
    const commit = git(cwd, "rev-parse", "HEAD");
    const epoch = Number(git(cwd, "show", "-s", "--format=%ct", "HEAD"));
    assert.equal(clean.release, DEVELOPMENT_RELEASE);
    assert.equal(clean.commit, commit);
    assert.equal(clean.builtAt, new Date(epoch * 1000).toISOString());

    writeFileSync(join(cwd, "source.txt"), "dirty\n");
    assert.equal(createBuildIdentity({ cwd }).release, `${DEVELOPMENT_RELEASE}+dirty`);
  } finally {
    cleanup(cwd);
  }
});

test("malformed and lightweight tags cannot become release identities", () => {
  const cwd = fixture();
  try {
    assert.match(validateReleaseIdentity({ cwd, release: "release-1.2.3" }).join("\n"), /vMAJOR\.MINOR\.PATCH/);
    git(cwd, "tag", "v1.2.3");
    assert.match(validateReleaseIdentity({ cwd, release: "v1.2.3" }).join("\n"), /must be annotated/);
    assert.throws(() => createBuildIdentity({ cwd, release: "v1.2.3" }), /must be annotated/);
  } finally {
    cleanup(cwd);
  }
});

test("package mismatch and wrong-commit tags fail closed", () => {
  const mismatch = fixture("1.2.4");
  try {
    git(mismatch, "tag", "-a", "v1.2.3", "-m", "v1.2.3");
    assert.match(validateReleaseIdentity({ cwd: mismatch, release: "v1.2.3" }).join("\n"), /does not match release/);
  } finally {
    cleanup(mismatch);
  }

  const descendant = fixture();
  try {
    git(descendant, "tag", "-a", "v1.2.3", "-m", "v1.2.3");
    writeFileSync(join(descendant, "source.txt"), "two\n");
    git(descendant, "add", "source.txt");
    git(descendant, "commit", "-q", "-m", "descendant");
    assert.match(validateReleaseIdentity({ cwd: descendant, release: "v1.2.3" }).join("\n"), /does not point at checked-out HEAD/);
  } finally {
    cleanup(descendant);
  }
});

test("caller supplied BUILD_COMMIT cannot forge generated identity", () => {
  const cwd = fixture();
  const previous = process.env.BUILD_COMMIT;
  try {
    process.env.BUILD_COMMIT = "0000000000000000000000000000000000000000";
    const identity = createBuildIdentity({ cwd });
    assert.equal(identity.commit, git(cwd, "rev-parse", "HEAD"));
    assert.notEqual(identity.commit, process.env.BUILD_COMMIT);
  } finally {
    if (previous === undefined) delete process.env.BUILD_COMMIT;
    else process.env.BUILD_COMMIT = previous;
    cleanup(cwd);
  }
});

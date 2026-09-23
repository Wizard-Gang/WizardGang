import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const helper = new URL("../scripts/check-patch-integrity.mjs", import.meta.url).pathname;
const git = (cwd, ...args) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), "wg-patch-"));
  git(cwd, "init", "-q");
  git(cwd, "config", "user.name", "Fixture");
  git(cwd, "config", "user.email", "fixture@example.invalid");
  writeFileSync(join(cwd, "source.txt"), "base\n");
  git(cwd, "add", "source.txt");
  git(cwd, "commit", "-q", "-m", "base");
  return { cwd, base: git(cwd, "rev-parse", "HEAD") };
}
function run(cwd, base = "", head = "") {
  return spawnSync(process.execPath, [helper], { cwd, env: { ...process.env, PATCH_BASE_SHA: base, PATCH_HEAD_SHA: head }, encoding: "utf8" });
}
test("clean committed patch passes and whitespace defect fails", () => {
  const { cwd, base } = fixture();
  writeFileSync(join(cwd, "source.txt"), "base\nclean\n");
  git(cwd, "add", "source.txt");
  git(cwd, "commit", "-q", "-m", "clean");
  const clean = git(cwd, "rev-parse", "HEAD");
  assert.equal(run(cwd, base, clean).status, 0);
  writeFileSync(join(cwd, "source.txt"), "base\nclean\nbad   \n");
  git(cwd, "add", "source.txt");
  git(cwd, "commit", "-q", "-m", "bad");
  const bad = git(cwd, "rev-parse", "HEAD");
  assert.notEqual(run(cwd, clean, bad).status, 0);
});
test("incomplete or invalid explicit range fails", () => {
  const { cwd, base } = fixture();
  assert.notEqual(run(cwd, base, "").status, 0);
  assert.notEqual(run(cwd, "bad", base).status, 0);
});

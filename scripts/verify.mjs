import { readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const testsDir = resolve(root, "tests");
const tests = (await readdir(testsDir))
  .filter((name) => name.endsWith(".test.mjs"))
  .sort()
  .map((name) => resolve(testsDir, name));

if (!tests.length) {
  console.error("No acceptance tests were found under tests/*.test.mjs.");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...tests], {
  cwd: root,
  stdio: "inherit"
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}
process.exit(result.status ?? 1);

import { spawnSync } from "node:child_process";

const base = (process.env.PATCH_BASE_SHA ?? "").trim();
const head = (process.env.PATCH_HEAD_SHA ?? "").trim();
if (Boolean(base) !== Boolean(head)) {
  console.error("PATCH_BASE_SHA and PATCH_HEAD_SHA must be provided together.");
  process.exit(1);
}
if (!base) {
  console.log("No explicit committed patch range supplied; committed-range check skipped.");
  process.exit(0);
}
for (const [name, sha] of [["PATCH_BASE_SHA", base], ["PATCH_HEAD_SHA", head]]) {
  if (!/^[0-9a-f]{40}$/.test(sha) || spawnSync("git", ["cat-file", "-e", `${sha}^{commit}`]).status !== 0) {
    console.error(`${name} must name a full commit SHA present in this checkout.`);
    process.exit(1);
  }
}
const result = spawnSync("git", ["diff", "--check", `${base}..${head}`], { encoding: "utf8" });
if (result.status !== 0) {
  process.stderr.write(result.stdout + result.stderr);
  console.error("Committed patch integrity failed.");
  process.exit(1);
}
console.log(`Committed patch integrity passed for ${base}..${head}.`);

import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPages } from "../src/site.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

function gitCommit() {
  if (process.env.BUILD_COMMIT) return process.env.BUILD_COMMIT.slice(0, 12);
  try {
    return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "development";
  }
}

const build = {
  product: "WizardGang Portfolio",
  commit: gitCommit(),
  builtAt: new Date().toISOString()
};

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, "public"), dist, { recursive: true });
await mkdir(resolve(dist, "assets"), { recursive: true });
const baseStyles = await readFile(resolve(root, "src/styles.css"), "utf8");
const portfolioStyles = await readFile(resolve(root, "src/portfolio-cleanup.css"), "utf8");
await writeFile(resolve(dist, "assets/styles.css"), `${baseStyles.trim()}\n\n${portfolioStyles.trim()}\n`);

for (const [relative, contents] of createPages(build)) {
  const target = resolve(dist, relative);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

await writeFile(resolve(dist, "version.json"), `${JSON.stringify(build, null, 2)}\n`);
console.log(`Built ${createPages(build).size} HTML pages at ${build.commit}.`);

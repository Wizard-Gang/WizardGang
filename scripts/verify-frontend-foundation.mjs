import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const output = resolve(root, "tmp/frontend-foundation");
const disposableRoot = resolve(root, "tmp");

assert.ok(
  output.startsWith(`${disposableRoot}${sep}`),
  "frontend foundation output must stay under tmp/"
);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const files = await walk(output);
const byExtension = (extension) => files.filter((file) => extname(file) === extension);

const htmlFiles = byExtension(".html");
const cssFiles = byExtension(".css");
const jsFiles = byExtension(".js");
const svgFiles = byExtension(".svg");

assert.equal(htmlFiles.length, 1, "Vite foundation build must emit exactly one migration-only HTML entry");
assert.ok(cssFiles.length >= 1, "Tailwind foundation build must emit CSS");
assert.ok(jsFiles.length >= 1, "React/Vite foundation build must emit JavaScript");
assert.ok(svgFiles.length >= 1, "Vite foundation build must resolve and emit the imported SVG asset");

const css = (await Promise.all(cssFiles.map((file) => readFile(file, "utf8")))).join("\n");
assert.match(css, /\.min-h-screen\b/, "Tailwind did not emit the migration harness utility classes");
assert.match(css, /\.rounded-2xl\b/, "Tailwind utility generation is incomplete");

const javascript = (await Promise.all(jsFiles.map((file) => readFile(file, "utf8")))).join("\n");
assert.match(javascript, /WG-038 migration harness/, "React migration harness content is missing from the Vite bundle");

console.log(
  `Verified frontend foundation: ${htmlFiles.length} HTML, ${cssFiles.length} CSS, ${jsFiles.length} JS, ${svgFiles.length} SVG artifact(s).`
);

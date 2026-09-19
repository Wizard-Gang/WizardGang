import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const readRoot = (path) => readFile(resolve(root, path), "utf8");

const documentSource = await readRoot("src/app/Document.tsx");
const chromeSource = await readRoot("src/components/SiteChrome.tsx");
const legacySource = await readRoot("src/site.mjs");
const home = await readRoot("dist/index.html");

assert.match(documentSource, /renderToStaticMarkup/, "React server rendering must own static document composition");
assert.match(documentSource, /data-wizardgang-legacy-body/, "the transitional legacy body boundary must remain explicit");
assert.doesNotMatch(documentSource, /react-dom\/client|hydrateRoot|createRoot/, "the shared shell must not require client React hydration");
assert.match(chromeSource, /Skip to main content/);
assert.match(chromeSource, /Primary mobile/);
assert.match(chromeSource, /Preferences/);
assert.match(chromeSource, /Software engineering portfolio/);

for (const legacyFunction of ["header", "displaySettings", "footer", "document"]) {
  assert.doesNotMatch(legacySource, new RegExp(`function\\s+${legacyFunction}\\b`), `legacy ${legacyFunction}() must not remain authoritative`);
}
for (const legacyShellMarker of ["site-header", "display-settings", "site-footer", "<!doctype html>", "<html", "<head>"]) {
  assert.ok(!legacySource.includes(legacyShellMarker), `src/site.mjs still contains shared-shell marker: ${legacyShellMarker}`);
}

assert.match(home, /^<!doctype html>/i);
assert.match(home, /<html\b[^>]*lang="en"/i);
assert.match(home, /<header\b[^>]*class="site-header"/i);
assert.match(home, /<footer\b[^>]*class="site-footer"/i);
assert.match(home, /<main\b[^>]*id="main"/i);
assert.doesNotMatch(home, /data-wizardgang-legacy-body/, "the build must replace the compatibility placeholder");
assert.doesNotMatch(home, /id="root"|react-dom\/client|hydrateRoot|createRoot/, "production HTML must not expose a React client mount contract");

await assert.rejects(access(resolve(root, "src/app/foundation/main.tsx")), { code: "ENOENT" });
await assert.rejects(access(resolve(root, "scripts/verify-frontend-foundation.mjs")), { code: "ENOENT" });

console.log("Verified React static shell authority and retired WG-038 proof harness.");

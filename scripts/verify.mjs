import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const failures = [];
const fail = (message) => failures.push(message);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function count(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function internalTarget(href) {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  const pathname = href.split(/[?#]/)[0];
  if (!pathname || pathname === "/") return "index.html";
  if (extname(pathname)) return pathname.slice(1);
  return `${pathname.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
if (htmlFiles.length !== 9) fail(`expected 9 HTML pages, found ${htmlFiles.length}`);

for (const file of htmlFiles) {
  const relative = file.slice(dist.length + 1);
  const html = await readFile(file, "utf8");
  if (count(html, /<h1(?:\s|>)/g) !== 1) fail(`${relative}: expected exactly one h1`);
  if (!html.includes('class="skip-link"')) fail(`${relative}: missing skip link`);
  if (!html.includes('<nav class="site-nav" aria-label="Primary">')) fail(`${relative}: missing primary navigation`);
  if (!/<title>[^<]{12,}<\/title>/.test(html)) fail(`${relative}: missing descriptive title`);
  if (!/<meta name="description" content="[^"]{40,}">/.test(html)) fail(`${relative}: missing meta description`);
  if (!html.includes('property="og:title"') || !html.includes('property="og:description"')) fail(`${relative}: incomplete Open Graph metadata`);
  if (!html.includes('name="twitter:title"') || !html.includes('name="twitter:description"')) fail(`${relative}: incomplete Twitter metadata`);
  if (/<script(?:\s|>)/i.test(html)) fail(`${relative}: portfolio HTML must not ship client JavaScript`);
  // The site ships `style-src 'self'`, so a <style> element or a style attribute is
  // dropped by the browser and the markup renders unstyled. Keep CSS in src/styles.css.
  if (/<style(?:\s|>)/i.test(html)) fail(`${relative}: inline <style> is blocked by the style-src policy`);
  if (/\sstyle="/i.test(html)) fail(`${relative}: inline style attribute is blocked by the style-src policy`);
  if (/ShadowMoney|WizardGangLocal|github\.com\/SouthernGentlemen\/(?:Hexframe|WizardGangLocal)/i.test(html)) fail(`${relative}: exposes a retired name or private repository URL`);
  const yarReaderLinks = [...html.matchAll(/href="(https:\/\/github\.com\/SouthernGentlemen\/YarReader[^"]*)"/g)].map((match) => match[1]);
  if (yarReaderLinks.some((href) => href !== "https://github.com/SouthernGentlemen/YarReader")) fail(`${relative}: contains a non-canonical YarReader source URL`);
  if (/Evergreen Dr|29631|jacobyongue@outlook\.com|865[ -]?9031/i.test(html)) fail(`${relative}: exposes private contact information from a source document`);
  if (/coming soon|disabled/i.test(html)) fail(`${relative}: contains a disabled/coming-soon action`);
  if (relative !== "404.html" && !html.includes('<link rel="canonical" href="https://wizardgang.ai/')) fail(`${relative}: missing canonical URL`);
  if (relative === "404.html" && !html.includes('name="robots" content="noindex"')) fail(`${relative}: 404 must be noindex`);

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    const target = internalTarget(href);
    if (!target) continue;
    try { await access(resolve(dist, target)); }
    catch { fail(`${relative}: broken internal link ${href}`); }
  }
}

const required = [
  "_headers",
  "assets/styles.css",
  "favicon.svg",
  "og.jpg",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest",
  "version.json",
  "logos/airbnb.svg",
  "logos/amware.png",
  "logos/brixton.png",
  "logos/hybrid-apparel.png",
  "logos/plexus.svg",
  "logos/rocky-brands.png",
  "logos/spartan.png",
  "logos/supply-chain-technologies.png",
  "logos/torque-king.png"
];
for (const file of required) {
  try { await access(resolve(dist, file)); }
  catch { fail(`missing build artifact ${file}`); }
}

const yarReaderCaseStudy = await readFile(resolve(dist, "work/yarreader/index.html"), "utf8");
if (!yarReaderCaseStudy.includes('href="https://github.com/SouthernGentlemen/YarReader"')) fail("YarReader case study is missing its canonical public source link");

const worker = await readFile(resolve(root, "src/worker.mjs"), "utf8");
if (/DurableObject|\bD1\b|\bR2\b|authentication|OPS_TOKEN/.test(worker)) fail("portfolio Worker gained a product binding or authentication concern");
if (!worker.includes("sharktank.wizardgang.ai")) fail("compatibility Worker is missing the Shark Tank boundary");

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log(`Verified ${htmlFiles.length} HTML pages, internal links, metadata, static assets, and the stateless migration boundary.`);

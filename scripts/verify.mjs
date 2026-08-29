import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const failures = [];
const fail = (message) => failures.push(message);
const WIZARDGANG_REPO = "https://github.com/Wizard-Gang/WizardGang";
const productRepositories = [
  "https://github.com/SouthernGentlemen/SharkTank",
  "https://github.com/SouthernGentlemen/Hexframe",
  "https://github.com/SouthernGentlemen/YarReader"
];

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
  if (/ShadowMoney|WizardGangLocal|github\.com\/SouthernGentlemen\/WizardGangLocal/i.test(html)) fail(`${relative}: exposes a retired name or private repository URL`);
  if (productRepositories.some((href) => html.includes(`href="${href}"`))) fail(`${relative}: links a project to a retired per-project repository`);
  if (/Evergreen Dr|29631|865[ -]?9031/i.test(html)) fail(`${relative}: exposes a private street address, ZIP, or phone number from a source document`);
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

for (const [slug, source] of [["sharktank", "Shark Tank"], ["hexframe", "Hexframe"], ["yarreader", "YarReader"]]) {
  const caseStudy = await readFile(resolve(dist, `work/${slug}/index.html`), "utf8");
  const expected = `href="${WIZARDGANG_REPO}"`;
  if (!caseStudy.includes(expected)) fail(`${source} project page is missing the WizardGang repository link`);
  if (slug === "yarreader" && (!caseStudy.includes('data-fixture="synthetic"') || !caseStudy.includes("Synthetic catalog"))) {
    fail("YarReader case study must identify its preview catalog as synthetic");
  }
}

const worker = await readFile(resolve(root, "src/worker.mjs"), "utf8");
if (/DurableObject|\bD1\b|\bR2\b|authentication|OPS_TOKEN/.test(worker)) fail("portfolio Worker gained a product binding or authentication concern");
if (!worker.includes("sharktank.wizardgang.ai")) fail("compatibility Worker is missing the Shark Tank boundary");

const ownership = await readFile(resolve(root, "docs/OWNERSHIP.md"), "utf8");
for (const source of productRepositories) {
  if (!ownership.includes(source)) fail(`ownership record is missing ${source}`);
}
if (!/`WizardGangLocal` is retired\./.test(ownership)) fail("ownership record does not retire WizardGangLocal");

const resumePage = await readFile(resolve(dist, "resume/index.html"), "utf8");
if (!resumePage.includes("Professional<br><span>Systems.</span>")) fail("resume page is missing the Professional Systems heading");
if (/Download resume|JacobYongue_Resume\.pdf|Systems builder|Delivery owner/.test(resumePage)) fail("resume page still contains the retired resume surface");
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  if (!/href="mailto:jacobyongue@outlook\.com"/.test(html)) fail(`${file.slice(dist.length + 1)}: missing a contact route`);
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log(`Verified ${htmlFiles.length} HTML pages, internal links, metadata, static assets, and the stateless migration boundary.`);

import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const failures = [];
const fail = (message) => failures.push(message);
const projectSlugs = ["sharktank", "hexframe", "yarreader"];
const retiredRepositories = [
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
if (htmlFiles.length !== 16) fail(`expected 16 HTML pages, found ${htmlFiles.length}`);

for (const file of htmlFiles) {
  const relative = file.slice(dist.length + 1);
  const html = await readFile(file, "utf8");
  if (count(html, /<h1(?:\s|>)/g) !== 1) fail(`${relative}: expected exactly one h1`);
  if (!html.includes('class="skip-link"')) fail(`${relative}: missing skip link`);
  if (!html.includes('<nav class="site-nav" aria-label="Primary">')) fail(`${relative}: missing primary navigation`);
  for (const label of ["Projects", "Work", "About", "Resume", "GitHub"]) {
    if (!html.includes(`>${label}`)) fail(`${relative}: missing ${label} navigation`);
  }
  if (!/<title>[^<]{12,}<\/title>/.test(html)) fail(`${relative}: missing descriptive title`);
  if (!/<meta name="description" content="[^"]{40,}">/.test(html)) fail(`${relative}: missing meta description`);
  if (!html.includes('property="og:title"') || !html.includes('property="og:description"')) fail(`${relative}: incomplete Open Graph metadata`);
  if (/<script(?:\s|>)/i.test(html)) fail(`${relative}: portfolio HTML must not ship client JavaScript`);
  if (/<style(?:\s|>)/i.test(html) || /\sstyle="/i.test(html)) fail(`${relative}: contains inline styles blocked by CSP`);
  if (/ShadowMoney|WizardGangLocal|github\.com\/SouthernGentlemen\/WizardGangLocal/i.test(html)) fail(`${relative}: exposes a retired name or private repository URL`);
  if (retiredRepositories.some((href) => html.includes(`href="${href}"`))) fail(`${relative}: links a retired per-project repository`);
  if (/Evergreen Dr|29631|865[ -]?9031/i.test(html)) fail(`${relative}: exposes private contact information`);
  if (/coming soon|disabled/i.test(html)) fail(`${relative}: contains a disabled or coming-soon action`);
  const compatibility = relative.startsWith("professional/") || (relative.startsWith("work/") && relative !== "work/index.html");
  if (relative === "404.html" || compatibility) {
    if (!html.includes('name="robots" content="noindex"')) fail(`${relative}: compatibility/404 page must be noindex`);
  } else if (!html.includes('<link rel="canonical" href="https://wizardgang.ai/')) {
    fail(`${relative}: missing canonical URL`);
  }
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const target = internalTarget(match[1]);
    if (!target) continue;
    try { await access(resolve(dist, target)); }
    catch { fail(`${relative}: broken internal link ${match[1]}`); }
  }
}

const required = [
  "_headers", "assets/styles.css", "favicon.svg", "og-jacob-yongue.jpg",
  "yarreader-library-art.jpg", "robots.txt", "sitemap.xml", "site.webmanifest", "version.json"
];
for (const file of required) {
  try { await access(resolve(dist, file)); }
  catch { fail(`missing build artifact ${file}`); }
}

const home = await readFile(resolve(dist, "index.html"), "utf8");
for (const requiredText of [
  "Jacob <span>Yongue.</span>",
  "Software engineer · Systems integration · Implementation · Project delivery",
  "I design, build, integrate, and deliver software systems from requirements through production.",
  "Selected projects", "Selected work", "Capabilities", "About"
]) {
  if (!home.includes(requiredText)) fail(`homepage missing ${requiredText}`);
}
for (const retired of ["Two bodies of work", "Different contexts. Clear boundaries.", "Independent build lab", "About WizardGang"]) {
  if (home.includes(retired)) fail(`homepage still contains retired positioning: ${retired}`);
}
if (!home.includes('content="https://wizardgang.ai/og-jacob-yongue.jpg"')) fail("homepage missing Jacob-first social preview");

for (const slug of projectSlugs) {
  const overview = await readFile(resolve(dist, `projects/${slug}/index.html`), "utf8");
  const caseStudy = await readFile(resolve(dist, `projects/${slug}/case-study/index.html`), "utf8");
  if (!overview.includes(`/projects/${slug}/case-study/`)) fail(`${slug} overview missing case-study link`);
  if (!caseStudy.includes(`/projects/${slug}/`)) fail(`${slug} case study missing overview link`);
  if (!overview.includes("GitHub") || !caseStudy.includes("GitHub")) fail(`${slug} pages missing source evidence`);
}

const yarOverview = await readFile(resolve(dist, "projects/yarreader/index.html"), "utf8");
const styles = await readFile(resolve(dist, "assets/styles.css"), "utf8");
if (!yarOverview.includes('data-fixture="synthetic"') || !yarOverview.includes("Original demo artwork") || !styles.includes('url("/yarreader-library-art.jpg")')) {
  fail("YarReader overview must use and identify original fictional demo artwork");
}

const work = await readFile(resolve(dist, "work/index.html"), "utf8");
for (const requiredText of ["Career history", "Systems delivered", "Integrations", "Deployments", "Real systems in real operations."]) {
  if (!work.includes(requiredText)) fail(`work page missing ${requiredText}`);
}

const about = await readFile(resolve(dist, "about/index.html"), "utf8");
for (const requiredText of ["About Jacob Yongue", "Systems thinking", "Implementation depth", "Project ownership", "Learning velocity", "WizardGang.ai is my personal engineering portfolio"]) {
  if (!about.includes(requiredText)) fail(`about page missing ${requiredText}`);
}

for (const [relative, destination] of [
  ["professional/index.html", "/work/"],
  ...projectSlugs.map((slug) => [`work/${slug}/index.html`, `/projects/${slug}/`])
]) {
  const html = await readFile(resolve(dist, relative), "utf8");
  if (!html.includes(`content="0;url=${destination}"`)) fail(`${relative}: missing compatibility redirect to ${destination}`);
}

const sitemap = await readFile(resolve(dist, "sitemap.xml"), "utf8");
for (const route of ["/projects/", "/projects/sharktank/case-study/", "/projects/hexframe/case-study/", "/projects/yarreader/case-study/", "/work/", "/about/", "/resume/"]) {
  if (!sitemap.includes(route)) fail(`sitemap missing ${route}`);
}

const worker = await readFile(resolve(root, "src/worker.mjs"), "utf8");
if (/DurableObject|\bD1\b|\bR2\b|authentication|OPS_TOKEN/.test(worker)) fail("portfolio Worker gained a product binding or authentication concern");
if (!worker.includes("sharktank.wizardgang.ai")) fail("compatibility Worker is missing the SharkTank boundary");

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log(`Verified ${htmlFiles.length} HTML pages, Jacob-first positioning, route depth, metadata, assets, internal links, and compatibility redirects.`);

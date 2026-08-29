import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PERMANENT_REDIRECTS } from "../src/worker.mjs";

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

function fragmentOf(href) {
  const index = href.indexOf("#");
  return index === -1 ? "" : decodeURIComponent(href.slice(index + 1));
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
if (htmlFiles.length !== 11) fail(`expected 11 canonical HTML pages, found ${htmlFiles.length}`);

for (const file of htmlFiles) {
  const relative = file.slice(dist.length + 1);
  const html = await readFile(file, "utf8");
  if (count(html, /<h1(?:\s|>)/g) !== 1) fail(`${relative}: expected exactly one h1`);
  if (!html.includes('class="skip-link"')) fail(`${relative}: missing skip link`);
  if (!html.includes('<nav class="site-nav" aria-label="Primary">')) fail(`${relative}: missing primary navigation`);
  for (const label of ["Projects", "Work", "About", "GitHub"]) {
    if (!html.includes(`>${label}`)) fail(`${relative}: missing ${label} navigation`);
  }
  if (html.includes('href="/resume') || html.includes(">Resume<")) fail(`${relative}: exposes retired Resume navigation or content`);
  if (!/<title>[^<]{12,}<\/title>/.test(html)) fail(`${relative}: missing descriptive title`);
  if (!/<meta name="description" content="[^"]{40,}">/.test(html)) fail(`${relative}: missing meta description`);
  if (!html.includes('property="og:title"') || !html.includes('property="og:description"')) fail(`${relative}: incomplete Open Graph metadata`);
  if (/<script(?:\s|>)/i.test(html)) fail(`${relative}: portfolio HTML must not ship client JavaScript`);
  if (/<style(?:\s|>)/i.test(html) || /\sstyle="/i.test(html)) fail(`${relative}: contains inline styles blocked by CSP`);
  if (/ShadowMoney|WizardGangLocal|github\.com\/SouthernGentlemen\/WizardGangLocal/i.test(html)) fail(`${relative}: exposes a retired name or private repository URL`);
  if (retiredRepositories.some((href) => html.includes(`href="${href}"`))) fail(`${relative}: links a retired per-project repository`);
  if (/Evergreen Dr|29631|865[ -]?9031/i.test(html)) fail(`${relative}: exposes private contact information`);
  if (/coming soon|disabled/i.test(html)) fail(`${relative}: contains a disabled or coming-soon action`);
  if (relative === "404.html") {
    if (!html.includes('name="robots" content="noindex"')) fail(`${relative}: 404 page must be noindex`);
  } else if (!html.includes('<link rel="canonical" href="https://wizardgang.ai/')) {
    fail(`${relative}: missing canonical URL`);
  }
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    if (match[1].startsWith("//")) fail(`${relative}: malformed protocol-relative URL ${match[1]}`);
    const target = internalTarget(match[1]);
    if (!target) continue;
    try {
      const targetPath = resolve(dist, target);
      await access(targetPath);
      const fragment = fragmentOf(match[1]);
      if (fragment && target.endsWith(".html")) {
        const targetHtml = await readFile(targetPath, "utf8");
        if (!targetHtml.includes(`id="${fragment}"`)) fail(`${relative}: broken anchor ${match[1]}`);
      }
    } catch { fail(`${relative}: broken internal link ${match[1]}`); }
  }
  for (const match of html.matchAll(/(?:src|content)="(\/[^"]+)"/g)) {
    const target = internalTarget(match[1]);
    if (!target || target.endsWith("/index.html")) continue;
    try { await access(resolve(dist, target)); }
    catch { fail(`${relative}: missing internal asset ${match[1]}`); }
  }
}

const required = [
  "_headers", "assets/styles.css", "favicon.svg", "og-jacob-yongue.jpg",
  "sharktank-project.jpg", "hexframe-project.jpg", "yarreader-library-art.jpg",
  "robots.txt", "sitemap.xml", "site.webmanifest", "version.json"
];
for (const file of required) {
  try { await access(resolve(dist, file)); }
  catch { fail(`missing build artifact ${file}`); }
}

const home = await readFile(resolve(dist, "index.html"), "utf8");
for (const requiredText of [
  "Jacob <span>Yongue.</span>",
  "Software engineer · Systems · Project delivery",
  "I design, build, integrate, and deliver software systems from requirements through production.",
  "Selected projects", "Selected work", "Capabilities", "About"
]) {
  if (!home.includes(requiredText)) fail(`homepage missing ${requiredText}`);
}
for (const retired of ["Two bodies of work", "Different contexts. Clear boundaries.", "Independent build lab", "About WizardGang"]) {
  if (home.includes(retired)) fail(`homepage still contains retired positioning: ${retired}`);
}
if (!home.includes('content="https://wizardgang.ai/og-jacob-yongue.jpg"')) fail("homepage missing Jacob-first social preview");
if (!home.includes('href="https://github.com/Wizard-Gang"')) fail("homepage generic GitHub action must target the Wizard-Gang organization");
if (!home.includes("WCAG") || !home.includes("Cost Governance")) fail("homepage project summaries are missing shared accessibility or governance capabilities");

for (const slug of projectSlugs) {
  const overview = await readFile(resolve(dist, `projects/${slug}/index.html`), "utf8");
  const caseStudy = await readFile(resolve(dist, `projects/${slug}/case-study/index.html`), "utf8");
  if (!overview.includes(`/projects/${slug}/case-study/`)) fail(`${slug} overview missing case-study link`);
  if (!caseStudy.includes(`/projects/${slug}/`)) fail(`${slug} case study missing overview link`);
  if (!overview.includes("GitHub") || !caseStudy.includes("GitHub")) fail(`${slug} pages missing source evidence`);
}

const expectedSources = new Map([
  ["sharktank", "https://github.com/Wizard-Gang/SharkTank"],
  ["hexframe", "https://github.com/Wizard-Gang/Hexframe"],
  ["yarreader", "https://github.com/Wizard-Gang/YarReader"]
]);
for (const [slug, source] of expectedSources) {
  const overview = await readFile(resolve(dist, `projects/${slug}/index.html`), "utf8");
  if (!overview.includes(`href="${source}"`)) fail(`${slug} overview does not link its standalone repository`);
}

const sharkCase = await readFile(resolve(dist, "projects/sharktank/case-study/index.html"), "utf8");
for (const text of ["ISO/IEC 27001", "ISO/IEC 42001", "100% uptime maintained", "WCAG 2.0 AA", "Cost governance", "Requirement → control → implementation → live evidence → operational record"]) {
  if (!sharkCase.includes(text)) fail(`SharkTank case study missing ${text}`);
}
const hexCase = await readFile(resolve(dist, "projects/hexframe/case-study/index.html"), "utf8");
for (const text of ["Accessibility shapes the application architecture", "WCAG 2.0 AA", "Complete keyboard operation", "reduced-motion", "focus restoration"]) {
  if (!hexCase.includes(text)) fail(`Hexframe case study missing ${text}`);
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

const sitemap = await readFile(resolve(dist, "sitemap.xml"), "utf8");
for (const route of ["/projects/", "/projects/sharktank/case-study/", "/projects/hexframe/case-study/", "/projects/yarreader/case-study/", "/work/", "/about/"]) {
  if (!sitemap.includes(route)) fail(`sitemap missing ${route}`);
}
if (sitemap.includes("/resume/") || sitemap.includes("/professional/") || sitemap.includes("/work/sharktank/")) fail("sitemap includes a retired compatibility route");

const expectedRedirects = new Map([
  ["/github", "https://github.com/Wizard-Gang"],
  ["/resume/", "/work/"],
  ["/professional/", "/work/"],
  ["/work/sharktank/", "/projects/sharktank/"],
  ["/work/shark-tank/", "/projects/sharktank/"],
  ["/work/hexframe/", "/projects/hexframe/"],
  ["/work/yarreader/", "/projects/yarreader/"]
]);
for (const [from, to] of expectedRedirects) {
  if (PERMANENT_REDIRECTS.get(from) !== to) fail(`${from}: expected direct permanent redirect to ${to}`);
}
for (const [from, to] of PERMANENT_REDIRECTS) {
  if (!to.startsWith("/")) continue;
  if (PERMANENT_REDIRECTS.has(to)) fail(`${from}: redirect chain or loop through ${to}`);
  const target = internalTarget(to);
  try { await access(resolve(dist, target)); }
  catch { fail(`${from}: redirect destination is missing ${to}`); }
}

const worker = await readFile(resolve(root, "src/worker.mjs"), "utf8");
if (/DurableObject|\bD1\b|\bR2\b|authentication|OPS_TOKEN/.test(worker)) fail("portfolio Worker gained a product binding or authentication concern");
if (!worker.includes("sharktank.wizardgang.ai")) fail("compatibility Worker is missing the SharkTank boundary");

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log(`Verified ${htmlFiles.length} canonical HTML pages, metadata, assets, internal links, anchors, repository URLs, accessibility positioning, and ${PERMANENT_REDIRECTS.size} direct compatibility redirects.`);

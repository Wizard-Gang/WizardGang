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
if (htmlFiles.length !== 12) fail(`expected 12 canonical HTML pages, found ${htmlFiles.length}`);

for (const file of htmlFiles) {
  const relative = file.slice(dist.length + 1);
  const html = await readFile(file, "utf8");
  if (count(html, /<h1(?:\s|>)/g) !== 1) fail(`${relative}: expected exactly one h1`);
  if (!html.includes('class="skip-link"')) fail(`${relative}: missing skip link`);
  if (!html.includes('<nav class="site-nav" aria-label="Primary">')) fail(`${relative}: missing primary navigation`);
  for (const label of ["Projects", "Work", "Services", "About", "GitHub"]) {
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
    if (PERMANENT_REDIRECTS.has(match[1].split(/[?#]/)[0])) continue;
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
  "Jacob <span>Yongue</span>",
  "I build systems that deliver.",
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
if (!home.includes("accessible interfaces") || !home.includes("accessible controls")) fail("homepage project summaries are missing shared accessibility capability");

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
for (const text of ["It starts with multiplayer gameplay", "ISO/IEC 27001", "ISO/IEC 42001", "The application code is 100% AI-generated", "100% uptime maintained", "Billable actions", "Policies and evidence", "WCAG 2.0 AA", "Jacob operates Shark Tank"]) {
  if (!sharkCase.includes(text)) fail(`SharkTank case study missing ${text}`);
}
for (const text of ["These sharks follow rules, not a trained AI model", "Computer sharks exist only to fill empty seats", "computer-controlled sharks are ordinary game logic", "The policies and evidence explain how the game is developed and operated", "incidents can happen"]) {
  if (sharkCase.includes(text)) fail(`SharkTank case study still contains the retired framing: ${text}`);
}
const hexCase = await readFile(resolve(dist, "projects/hexframe/case-study/index.html"), "utf8");
for (const text of ["Make every feature agree on what happened", "A playable training stage with one fighter and one practice dummy", "Freeze automatically when a hit connects", "Graphics show the fight; game rules decide it", "The lab supports different controls and display needs", "WCAG 2.0 AA", "Keyboard and gamepad controls", "Reduced motion", "Screen-reader messages"]) {
  if (!hexCase.includes(text)) fail(`Hexframe case study missing ${text}`);
}
const yarCase = await readFile(resolve(dist, "projects/yarreader/case-study/index.html"), "utf8");
for (const text of ["Each part has one job", "Do the hard work before the reader opens", "A library that can recover and be rebuilt", "digital fingerprint"]) {
  if (!yarCase.includes(text)) fail(`YarReader case study missing ${text}`);
}
for (const phrase of ["A complete path, not an isolated component", "Explicit ownership at every boundary", "The part worth looking at twice", "What exists now"] ) {
  if (hexCase.includes(phrase) || yarCase.includes(phrase)) fail(`technical case studies still contain dense placeholder heading: ${phrase}`);
}

const yarOverview = await readFile(resolve(dist, "projects/yarreader/index.html"), "utf8");
const projectsOverview = await readFile(resolve(dist, "projects/index.html"), "utf8");
const styles = await readFile(resolve(dist, "assets/styles.css"), "utf8");
if (!yarOverview.includes('data-fixture="synthetic"') || !yarOverview.includes("Original demo artwork") || !styles.includes('url("/yarreader-library-art.jpg")')) {
  fail("YarReader overview must use and identify original fictional demo artwork");
}
for (const marker of ["tank-food-eat-a", "tank-food-eat-b", "tank-food-eat-c", "tank-dash-trail", "tank-rocket-shot", "tank-rocket-burst"]) {
  if (!projectsOverview.includes(marker)) fail(`SharkTank project card is missing gameplay marker ${marker}`);
}
for (const marker of ["lab-dummy-a", "lab-dummy-b", "lab-contact-a", "lab-contact-b", "lab-health-970", "lab-health-950", ">30</text>", ">20</text>"]) {
  if (!projectsOverview.includes(marker)) fail(`Hexframe project card is missing combat marker ${marker}`);
}
for (const animation of ["tank-feed-a", "tank-feed-b", "tank-feed-c", "tank-player-gameplay", "tank-rocket-flight", "lab-dummy-a", "lab-dummy-b", "lab-dummy-health"]) {
  if (!styles.includes(`@keyframes ${animation}`)) fail(`project card gameplay is missing ${animation} animation`);
}

const work = await readFile(resolve(dist, "work/index.html"), "utf8");
for (const requiredText of ["Career history", "Systems delivered", "Integrations", "Deployments", "Real systems in real operations.", "Axon", "LexisNexis", "Shadow Money Wizard Gang", "Sep 2024 - Apr 2026", "Jun 2023 - Aug 2024"]) {
  if (!work.includes(requiredText)) fail(`work page missing ${requiredText}`);
}
for (const retiredText of ["Education &amp; certification", "Clemson University", "Independent venture", "Oct 2024 - Apr 2026", "Nov 2023 - Sep 2024"]) {
  if (work.includes(retiredText)) fail(`work page still contains retired content: ${retiredText}`);
}

const services = await readFile(resolve(dist, "services/index.html"), "utf8");
for (const requiredText of ["Launch the site", "Starter", "$95", "Business", "$195", "Owner+", "$350", "Up to 3 pages", "Up to 5 pages", "Up to 8 pages", 'href="/services/example/"']) {
  if (!services.includes(requiredText)) fail(`services page missing ${requiredText}`);
}

const about = await readFile(resolve(dist, "about/index.html"), "utf8");
for (const requiredText of ["About Jacob Yongue", "Systems thinking", "Implementation depth", "Project ownership", "Learning velocity"]) {
  if (!about.includes(requiredText)) fail(`about page missing ${requiredText}`);
}
for (const removedText of ["WizardGang.ai is my personal engineering portfolio", "Let’s talk about the system", "Professional work</a>"]) {
  if (about.includes(removedText)) fail(`about page still contains removed content: ${removedText}`);
}

const sitemap = await readFile(resolve(dist, "sitemap.xml"), "utf8");
for (const route of ["/projects/", "/projects/sharktank/case-study/", "/projects/hexframe/case-study/", "/projects/yarreader/case-study/", "/work/", "/services/", "/about/"]) {
  if (!sitemap.includes(route)) fail(`sitemap missing ${route}`);
}
if (sitemap.includes("/resume/") || sitemap.includes("/professional/") || sitemap.includes("/work/sharktank/")) fail("sitemap includes a retired compatibility route");

const expectedRedirects = new Map([
  ["/github", "https://github.com/Wizard-Gang"],
  ["/resume/", "/work/"],
  ["/professional/", "/work/"],
  ["/services/example/", "https://yourwebsite.wizardgang.ai/"],
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

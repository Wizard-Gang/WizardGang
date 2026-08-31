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
if (htmlFiles.length !== 14) fail(`expected 14 canonical HTML pages, found ${htmlFiles.length}`);

for (const file of htmlFiles) {
  const relative = file.slice(dist.length + 1);
  const html = await readFile(file, "utf8");
  if (count(html, /<h1(?:\s|>)/g) !== 1) fail(`${relative}: expected exactly one h1`);
  if (!html.includes('class="skip-link"')) fail(`${relative}: missing skip link`);
  if (!html.includes('<nav class="site-nav" aria-label="Primary" id="site-nav">')) fail(`${relative}: missing primary navigation`);
  if (!html.includes('<details class="nav-disclosure">') || !html.includes('<summary class="nav-toggle">')) fail(`${relative}: missing no-JavaScript mobile navigation disclosure`);
  for (const label of ["Projects", "Work", "About", "Contact", "GitHub"]) {
    if (!html.includes(`>${label}`)) fail(`${relative}: missing ${label} navigation`);
  }
  const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] ?? "";
  if (!footer) fail(`${relative}: missing site footer`);
  if (!footer.includes('href="mailto:jacob@wizardgang.ai">jacob@wizardgang.ai</a>')) fail(`${relative}: missing WizardGang footer email`);
  if (!footer.includes(">LinkedIn <span")) fail(`${relative}: missing LinkedIn footer link`);
  if (!/WizardGang\.ai · <a href="\/version\.json">Build [0-9a-f]{12}<\/a>/.test(footer)) fail(`${relative}: missing linked build hash`);
  if (footer.includes("View build metadata")) fail(`${relative}: wordy build metadata label remains`);
  for (const retiredFooterLink of [">Website services</a>", ">Compliance</a>", ">Glossary</a>"]) {
    if (footer.includes(retiredFooterLink)) fail(`${relative}: retired footer link remains: ${retiredFooterLink}`);
  }
  for (const id of ["page-language", "theme-dark", "theme-light", "reading-layout", "text-size-200", "play-previews"]) {
    if (!html.includes(`id="${id}"`)) fail(`${relative}: missing display setting ${id}`);
  }
  if (!html.includes('id="play-previews" aria-describedby="motion-setting-help" checked')) fail(`${relative}: preview motion must play by default`);
  if (!html.includes(">Preferences</summary>")) fail(`${relative}: missing preferences disclosure`);
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const visible = match[2].replace(/<[^>]+>/g, " ").replace(/[↗→]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
    if (["play", "case study", "github", "evidence"].includes(visible) && /class="[^"]*(?:button|text-link)[^"]*"/i.test(match[1]) && !/\saria-label="[^"]{12,}"/i.test(match[1])) {
      fail(`${relative}: compact ${visible} link is missing a descriptive accessible name`);
    }
  }
  if (/target="_blank"/i.test(html)) fail(`${relative}: forces an external link into a new tab`);
  if (html.includes('href="/resume') || html.includes(">Resume<")) fail(`${relative}: exposes retired Resume navigation or content`);
  if (!/<title>[^<]{12,}<\/title>/.test(html)) fail(`${relative}: missing descriptive title`);
  if (!/<meta name="description" content="[^"]{40,}">/.test(html)) fail(`${relative}: missing meta description`);
  if (!html.includes('property="og:title"') || !html.includes('property="og:description"')) fail(`${relative}: incomplete Open Graph metadata`);
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  if (scripts.length !== 1 || !/\ssrc="\/assets\/site\.js\?v=[^"]+"/.test(scripts[0]?.[1] || "") || scripts[0]?.[2].trim()) {
    fail(`${relative}: must load exactly the first-party preferences script without inline JavaScript`);
  }
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
  "_headers", "assets/styles.css", "assets/site.js", "favicon.svg", "og-jacob-yongue.jpg",
  "sharktank-project.jpg", "hexframe-project.jpg", "yarreader-library-art.jpg",
  "robots.txt", "sitemap.xml", "site.webmanifest", "version.json"
];
for (const file of required) {
  try { await access(resolve(dist, file)); }
  catch { fail(`missing build artifact ${file}`); }
}
for (const file of ["README.md", "SECURITY.md", "docs/ACCESSIBILITY.md", "docs/COMPLIANCE.md"]) {
  try { await access(resolve(root, file)); }
  catch { fail(`missing public compliance record ${file}`); }
}

const home = await readFile(resolve(dist, "index.html"), "utf8");
for (const requiredText of [
  "Jacob <span>Yongue</span>",
  "I build systems that ship.",
  "Software engineer · Systems · Project delivery",
  "I design, build, connect, and launch software, then help teams keep it working in production.",
  "Selected projects", "Selected work", "Capabilities", "About"
]) {
  if (!home.includes(requiredText)) fail(`homepage missing ${requiredText}`);
}
for (const retired of ["Two bodies of work", "Different contexts. Clear boundaries.", "Independent build lab", "About WizardGang"]) {
  if (home.includes(retired)) fail(`homepage still contains retired positioning: ${retired}`);
}
if (!home.includes('content="https://wizardgang.ai/og-jacob-yongue.jpg"')) fail("homepage missing Jacob-first social preview");
if (!home.includes('href="https://github.com/Wizard-Gang"')) fail("homepage generic GitHub action must target the Wizard-Gang organization");
const expectedHomeActions = `<div class="button-row"><a class="button button-primary" href="/projects/">View projects</a><a class="button" href="mailto:jacob@wizardgang.ai">Get in touch</a></div>`;
if (!home.includes(expectedHomeActions)) fail("homepage must expose only the View projects and Get in touch hero actions");
if (/plain-language-summary|What I do, without the technical shorthand/i.test(home)) fail("homepage still contains the removed plain-language summary");
if (home.indexOf("<h1") > home.indexOf("<h2")) fail("homepage must expose its h1 before any h2");
if (home.indexOf("<h1") > home.indexOf("I build systems that ship.")) fail("homepage must expose Jacob's h1 before the tagline");
if (count(home, /class="project-card-visual" aria-hidden="true" inert/g) !== 3) fail("homepage project previews must be decorative and inert");
for (const servicePreview of ["selected-services", "Your website. Your code. Your infrastructure.", "View services", "services-teaser-copy"]) {
  if (home.includes(servicePreview)) fail(`homepage still contains services preview content: ${servicePreview}`);
}
if (!home.includes("accessible interfaces") || !home.includes("accessible controls")) fail("homepage project summaries are missing shared accessibility capability");

for (const slug of projectSlugs) {
  const overview = await readFile(resolve(dist, `projects/${slug}/index.html`), "utf8");
  const caseStudy = await readFile(resolve(dist, `projects/${slug}/case-study/index.html`), "utf8");
  if (!overview.includes(`/projects/${slug}/case-study/`)) fail(`${slug} overview missing case-study link`);
  if (!caseStudy.includes(`/projects/${slug}/`)) fail(`${slug} case study missing overview link`);
  if (!overview.includes("GitHub") || !caseStudy.includes("GitHub")) fail(`${slug} pages missing source evidence`);
  if (!overview.includes('class="case-visual showcase-visual" aria-hidden="true" inert')) fail(`${slug} overview preview must be decorative and inert`);
  if (!caseStudy.includes('class="case-visual" aria-hidden="true" inert')) fail(`${slug} case-study preview must be decorative and inert`);
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
const siteScript = await readFile(resolve(dist, "assets/site.js"), "utf8");
if (!yarOverview.includes('data-fixture="synthetic"') || !yarOverview.includes("Original demo artwork") || !styles.includes('url("/yarreader-library-art.jpg")')) {
  fail("YarReader overview must use and identify original fictional demo artwork");
}
for (const marker of ["tank-food-eat-a", "tank-food-eat-b", "tank-food-eat-c", "tank-dash-trail", "tank-rocket-shot", "tank-rocket-burst", "tank-abilities", "tank-dash", "tank-rocket"]) {
  if (!projectsOverview.includes(marker)) fail(`SharkTank project card is missing gameplay marker ${marker}`);
}
if (projectsOverview.includes("tank-player-dash-icon") || projectsOverview.includes("tank-player-rocket-icon")) fail("SharkTank ability icons must not be attached to the shark");
for (const marker of ["lab-dummy-a", "lab-dummy-b", "lab-contact-a", "lab-contact-b", "lab-health-970", "lab-health-950", "lab-bone-a-arm_upper_r", "lab-hit-window-a", "lab-hit-window-b", "hexframe-move-data", "Startup frames", "Cancel frames", "<td>30</td>", "<td>20</td>"]) {
  if (!projectsOverview.includes(marker)) fail(`Hexframe project card is missing combat marker ${marker}`);
}
if (/<text(?:\s|>)/i.test(projectsOverview) || /<animate(?:Transform)?(?:\s|>)/i.test(projectsOverview)) fail("project previews must not render text or uncontrolled motion inside SVG");
for (const animation of ["tank-feed-a", "tank-feed-b", "tank-feed-c", "tank-player-gameplay", "tank-rocket-flight", "lab-bone-a-arm-upper", "lab-hit-window-a", "lab-hit-window-b", "lab-dummy-a", "lab-dummy-b", "lab-dummy-health"]) {
  if (!styles.includes(`@keyframes ${animation}`)) fail(`project card gameplay is missing ${animation} animation`);
}
for (const accessibilityStyle of [
  ".project-visual * { animation-play-state: paused !important; }",
  "body:has(#play-previews:checked) .project-visual * { animation-play-state: running !important; }",
  "html:has(#text-size-200:checked) { font-size: 200%; }",
  "body:has(#theme-light:checked)",
  ".nav-disclosure[open] .site-nav { display: flex; }",
  "--line: #6f6a75",
  "min-height: 44px",
  "#c7d0d7",
  "#c8cedb",
  "#c9c4e4"
]) {
  if (!styles.includes(accessibilityStyle)) fail(`compiled styles missing accessibility rule ${accessibilityStyle}`);
}
for (const navigationBehavior of ['navDisclosure.toggleAttribute("open", open)', 'event.key === "Escape"']) {
  if (!siteScript.includes(navigationBehavior)) fail(`site script missing mobile navigation behavior: ${navigationBehavior}`);
}
if (/tank-rocket-flame\s+\.(?:0|1|2|3)\d?s/i.test(styles)) {
  fail("project preview flame animation must stay below three flashes per second");
}

const work = await readFile(resolve(dist, "work/index.html"), "utf8");
for (const requiredText of ["Career history", "Systems delivered", "Integrations", "Deployments", "Real systems in real operations.", "Systems organized by what they do.", "Enterprise, warehouse, logistics, commerce, development, and automation platforms integrated into production workflows.", "Organization links are provided for identification only.", "Axon", "LexisNexis", "CIMS WMS", "Shadow Money Wizard Gang", "Sep 2024 - Apr 2026", "Jun 2023 - Aug 2024"]) {
  if (!work.includes(requiredText)) fail(`work page missing ${requiredText}`);
}
for (const retiredWorkCopy of ["Grouped by the problem and operating environment", "Selected examples from each category", "Selected deployment context from Jacob’s employment history", "All integrations", "All deployments", "All core skills", 'class="work-disclosure"']) {
  if (work.includes(retiredWorkCopy)) fail(`work page still contains ${retiredWorkCopy}`);
}
for (const integrationLink of [
  'href="https://www.axon.com/"',
  'href="https://www.lexisnexis.com/en-us/"',
  'href="https://cloudimsystems.com/"'
]) {
  if (!work.includes(integrationLink)) fail(`work page missing integration link ${integrationLink}`);
}
for (const retiredText of ["Education &amp; certification", "Clemson University", "Independent venture", "Oct 2024 - Apr 2026", "Nov 2023 - Sep 2024"]) {
  if (work.includes(retiredText)) fail(`work page still contains retired content: ${retiredText}`);
}

const services = await readFile(resolve(dist, "services/index.html"), "utf8");
for (const requiredText of ["Launch the site", "Keep the keys", "The website is yours", "Your website. Your code. Your infrastructure.", "No required monthly hosting subscription for qualifying sites", "What drives what?", "Built to be handed over", "Add infrastructure when the business needs it", "Starter", "$95", "Business", "$195", "Owner+", "$350", "Up to 3 pages", "Up to 5 pages", "Up to 8 pages", 'href="https://yourwebsite.wizardgang.ai/how-it-works/"']) {
  if (!services.includes(requiredText)) fail(`services page missing ${requiredText}`);
}
if (!services.includes('<span class="services-hero-line-primary">Launch the site.</span><span>Keep the keys.</span>')) fail("services desktop headline lines are not explicit");
for (const firstPersonCopy of ["I don’t sell you a website subscription", "I build you a small piece of software", "I can build, configure, test, and launch the site", "I do not have to stay in the middle"]) {
  if (!services.includes(firstPersonCopy)) fail(`services page missing first-person voice: ${firstPersonCopy}`);
}
for (const agencyVoice of ["We don’t sell", "We build you", "WizardGang can build", "WizardGang does not have to stay"]) {
  if (services.includes(agencyVoice)) fail(`services page still contains agency voice: ${agencyVoice}`);
}
for (const forbiddenClaim of ["$0 hosting forever", "$0/month forever"]) {
  if (services.includes(forbiddenClaim)) fail(`services page contains unqualified cost claim: ${forbiddenClaim}`);
}

const about = await readFile(resolve(dist, "about/index.html"), "utf8");
for (const requiredText of ["About Jacob Yongue", "Systems thinking", "Implementation depth", "Project ownership", "Learning velocity"]) {
  if (!about.includes(requiredText)) fail(`about page missing ${requiredText}`);
}

const compliance = await readFile(resolve(dist, "compliance/index.html"), "utf8");
for (const requiredText of ["Compliance.", "WCAG 2.2 AA", "Level A", "Level AA", "route-by-route testing target", "not a certification or blanket conformance claim", "ISO/IEC 27001:2022", "ISO/IEC 42001:2023", "AI-developed. Human-reviewed.", "✓ Met", "◐ Partial", "Report an issue."]) {
  if (!compliance.includes(requiredText)) fail(`compliance page missing ${requiredText}`);
}
if (count(compliance, /class="compliance-item wcag-item"/g) !== 55) fail("compliance page must list all 55 WCAG 2.2 Level A and AA success criteria");
if (count(compliance, /class="compliance-item iso-item"/g) !== 16) fail("compliance page must list the 16 portfolio-wide ISO clauses and annex records");
if (count(compliance, /status-met/g) !== 62 || count(compliance, /status-partial/g) !== 9 || count(compliance, /status-gap/g) !== 0) {
  fail("compliance page status totals must remain 62 met, 9 partial, and 0 gaps");
}
if (count(compliance, /href="https:\/\/www\.w3\.org\/TR\/WCAG22\/#/g) !== 55) fail("every WCAG 2.2 A and AA checklist item must link directly to its official success criterion");
if (count(compliance, /href="https:\/\/github\.com\/Wizard-Gang\/WizardGang\/blob\/main\/docs\/COMPLIANCE\.md#iso-/g) !== 16) fail("every ISO checklist item must link directly to its public clause record");
for (const requiredText of ["Report issue", "Public documentation", "corresponding clause"]) {
  if (!compliance.includes(requiredText)) fail(`compliance page missing direct action or accessible link text: ${requiredText}`);
}
for (const retiredText of ["WCAG 2.0<br><span>checklist.</span>", "Level AAA", "A concise self-assessment of the main WizardGang portfolio pages", "SharkTank", "Project evidence"]) {
  if (compliance.includes(retiredText)) fail(`compliance page still contains retired content: ${retiredText}`);
}
const glossary = await readFile(resolve(dist, "glossary/index.html"), "utf8");
for (const requiredText of ["Technical terms.", "Artificial intelligence (AI)", "Application programming interface (API)", "Web Content Accessibility Guidelines (WCAG)"]) {
  if (!glossary.includes(requiredText)) fail(`glossary page missing ${requiredText}`);
}
try {
  await access(resolve(dist, "security/index.html"));
  fail("retired security page is still generated");
} catch { /* /security/ is now a redirect to Compliance. */ }
for (const requiredText of ["Español", "document.documentElement.lang = locale", "wizardgang.preferences.v1", "Jugar", "Caso de estudio", "Contraste (mejorado)", "Contexto de la organización", "Pautas de Accesibilidad para el Contenido Web", "Informar de un problema"]) {
  if (!siteScript.includes(requiredText)) fail(`preferences script missing Spanish internationalization behavior: ${requiredText}`);
}
for (const removedText of ["WizardGang.ai is my personal engineering portfolio", "Let’s talk about the system", "Professional work</a>"]) {
  if (about.includes(removedText)) fail(`about page still contains removed content: ${removedText}`);
}

const sitemap = await readFile(resolve(dist, "sitemap.xml"), "utf8");
for (const route of ["/projects/", "/projects/sharktank/case-study/", "/projects/hexframe/case-study/", "/projects/yarreader/case-study/", "/work/", "/services/", "/about/", "/compliance/", "/glossary/"]) {
  if (!sitemap.includes(route)) fail(`sitemap missing ${route}`);
}
if (sitemap.includes("/resume/") || sitemap.includes("/professional/") || sitemap.includes("/work/sharktank/") || sitemap.includes("/security/")) fail("sitemap includes a retired compatibility route");

const expectedRedirects = new Map([
  ["/github", "https://github.com/Wizard-Gang"],
  ["/resume/", "/work/"],
  ["/professional/", "/work/"],
  ["/accessibility/", "/compliance/"],
  ["/security/", "/compliance/"],
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
console.log(`Verified ${htmlFiles.length} canonical HTML pages, metadata, assets, internal links, anchors, repository URLs, compliance positioning, and ${PERMANENT_REDIRECTS.size} direct compatibility redirects.`);

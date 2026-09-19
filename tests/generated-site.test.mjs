import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import test from "node:test";
import { projects } from "../src/projects.mjs";
import { sanitizeLocalHeadersText } from "../scripts/dev.mjs";
import { PERMANENT_REDIRECTS } from "../src/worker/index.ts";
import {
  CANONICAL_PAGES,
  PROJECT_LINKS,
  SITEMAP_ROUTES,
  anchors,
  dist,
  exists,
  findAnchor,
  internalTarget,
  linkByRel,
  metaContent,
  readDist,
  readRoot,
  relativeFromDist,
  root,
  startTags,
  tagBlocks,
  textContent,
  walk
} from "./helpers.mjs";

const ORIGIN = "https://wizardgang.ai";
const canonicalFiles = [...CANONICAL_PAGES.keys()];

function allIds(html) {
  const ids = new Set();
  for (const tag of html.matchAll(/<[^!][^>]*>/g)) {
    const match = tag[0].match(/\sid=(?:"([^"]+)"|'([^']+)')/i);
    if (match) ids.add(match[1] ?? match[2]);
  }
  return ids;
}

function requireText(html, phrases, label) {
  for (const phrase of phrases) assert.ok(html.includes(phrase), `${label} is missing substantive content: ${phrase}`);
}

function rejectText(html, phrases, label) {
  for (const phrase of phrases) assert.ok(!html.includes(phrase), `${label} still contains retired content: ${phrase}`);
}

function anchorWithHref(html, href) {
  return anchors(html).find((anchor) => anchor.href === href);
}

test("generated HTML inventory is the explicit 13-page canonical contract", async () => {
  const actual = (await walk(dist))
    .filter((path) => path.endsWith(".html"))
    .map(relativeFromDist)
    .sort();
  assert.deepEqual(actual, [...canonicalFiles].sort());
  assert.equal(actual.length, 13);
});

test("all required public build artifacts and public records exist", async () => {
  const artifacts = [
    "_headers",
    "assets/styles.css",
    "assets/site.js",
    "favicon.svg",
    "site.webmanifest",
    "sitemap.xml",
    "robots.txt",
    "version.json",
    "og.jpg",
    "og-jacob-yongue.jpg",
    "sharktank-project.jpg",
    "hexframe-project.jpg",
    "yarreader-library-art.jpg"
  ];
  for (const file of artifacts) assert.equal(await exists(resolve(dist, file)), true, `missing build artifact ${file}`);
  for (const file of ["README.md", "SECURITY.md", "docs/ACCESSIBILITY.md", "docs/COMPLIANCE.md"]) {
    assert.equal(await exists(resolve(root, file)), true, `missing public record ${file}`);
  }
});

test("every canonical page preserves document, metadata, link, and local-asset behavior", async (t) => {
  for (const [relative, route] of CANONICAL_PAGES) {
    await t.test(relative, async () => {
      const html = await readDist(relative);
      const h1 = tagBlocks(html, "h1");
      assert.equal(h1.length, 1, "expected exactly one h1");
      assert.ok(textContent(h1[0].inner).length >= 3, "h1 must have meaningful text");

      const title = tagBlocks(html, "title");
      assert.equal(title.length, 1, "expected one title");
      assert.ok(textContent(title[0].inner).length >= 12, "title must be descriptive");
      const description = metaContent(html, "name", "description");
      assert.ok(description && description.length >= 40, "meta description must be meaningful");

      assert.equal(metaContent(html, "property", "og:title"), textContent(title[0].inner));
      assert.equal(metaContent(html, "property", "og:description"), description);
      assert.equal(metaContent(html, "name", "twitter:title"), textContent(title[0].inner));
      assert.equal(metaContent(html, "name", "twitter:description"), description);

      if (relative === "404.html") {
        assert.match(metaContent(html, "name", "robots") || "", /(?:^|,)\s*noindex\b/i);
        assert.equal(linkByRel(html, "canonical"), null);
        assert.equal(metaContent(html, "property", "og:url"), null);
      } else {
        const expected = `${ORIGIN}${route}`;
        assert.equal(linkByRel(html, "canonical")?.attrs.get("href"), expected);
        assert.equal(metaContent(html, "property", "og:url"), expected);
      }

      assert.equal(linkByRel(html, "icon")?.attrs.get("href"), "/favicon.svg");
      assert.equal(linkByRel(html, "manifest")?.attrs.get("href"), "/site.webmanifest");
      const stylesheet = linkByRel(html, "stylesheet")?.attrs.get("href") || "";
      assert.match(stylesheet, /^\/assets\/styles\.css\?v=.+/);

      const scripts = tagBlocks(html, "script");
      assert.ok(scripts.length >= 1, "must load the first-party browser script");
      for (const script of scripts) {
        assert.match(script.attrs.get("src") || "", /^\/assets\//, "scripts must remain first-party assets");
        assert.equal(textContent(script.inner), "", "inline JavaScript is not allowed");
      }
      assert.ok(scripts.some((script) => /^\/assets\/site\.js\?v=/.test(script.attrs.get("src") || "")));
      assert.equal(startTags(html, "style").length, 0, "inline style elements are not allowed");
      assert.doesNotMatch(html, /\sstyle\s*=/i, "inline style attributes are not allowed");
      assert.doesNotMatch(html, /\starget\s*=\s*["']_blank["']/i, "links must not force a new tab");

      rejectText(html, [
        "ShadowMoney",
        "WizardGangLocal",
        "github.com/SouthernGentlemen/WizardGangLocal",
        "github.com/SouthernGentlemen/SharkTank",
        "github.com/SouthernGentlemen/Hexframe",
        "github.com/SouthernGentlemen/YarReader",
        "Evergreen Dr",
        "29631"
      ], relative);
      assert.doesNotMatch(html, /865[ -]?9031/i, `${relative} exposes private contact information`);
      assert.doesNotMatch(html, /href=["']\/resume/i, `${relative} links the retired resume route`);
      assert.doesNotMatch(html, />\s*Resume\s*</i, `${relative} exposes retired Resume content`);
      assert.doesNotMatch(html, /coming soon|disabled/i, `${relative} contains a disabled or coming-soon action`);

      const ids = allIds(html);
      for (const anchor of anchors(html)) {
        assert.ok(!anchor.href.startsWith("//"), `malformed protocol-relative URL ${anchor.href}`);
        const pathname = anchor.href.startsWith("/") ? new URL(anchor.href, ORIGIN).pathname : "";
        if (pathname && PERMANENT_REDIRECTS.has(pathname)) continue;
        const target = internalTarget(anchor.href, relative);
        if (!target) continue;
        assert.equal(await exists(resolve(dist, target.relative)), true, `broken internal link ${anchor.href}`);
        if (target.fragment) {
          const targetIds = target.relative === relative ? ids : allIds(await readDist(target.relative));
          assert.ok(targetIds.has(target.fragment), `broken fragment link ${anchor.href}`);
        }
      }

      for (const tagName of ["img", "script", "source", "link"]) {
        for (const tag of startTags(html, tagName)) {
          const reference = tag.attrs.get("src") || tag.attrs.get("href") || "";
          if (!reference.startsWith("/") || reference.startsWith("//")) continue;
          const target = internalTarget(reference, relative);
          if (!target || !extname(new URL(reference, ORIGIN).pathname)) continue;
          assert.equal(await exists(resolve(dist, target.relative)), true, `missing referenced local asset ${reference}`);
        }
      }
    });
  }
});

test("social preview behavior remains page-appropriate", async () => {
  const home = await readDist("index.html");
  assert.equal(metaContent(home, "property", "og:image"), `${ORIGIN}/og-jacob-yongue.jpg`);
  assert.equal(metaContent(home, "property", "og:image:type"), "image/jpeg");
  assert.equal(metaContent(home, "property", "og:image:width"), "1200");
  assert.equal(metaContent(home, "property", "og:image:height"), "630");
  assert.match(metaContent(home, "property", "og:image:alt") || "", /Jacob Yongue/i);
  assert.equal(metaContent(home, "name", "twitter:card"), "summary_large_image");
  assert.equal(metaContent(home, "name", "twitter:image"), `${ORIGIN}/og-jacob-yongue.jpg`);

  for (const relative of canonicalFiles.filter((file) => file !== "index.html")) {
    const html = await readDist(relative);
    assert.equal(metaContent(html, "name", "twitter:card"), "summary", `${relative}: Twitter card behavior changed`);
    assert.equal(metaContent(html, "property", "og:image"), null, `${relative}: unexpected social image behavior`);
  }
});

test("build/version evidence is present and internally consistent", async () => {
  const version = JSON.parse(await readDist("version.json"));
  assert.equal(version.product, "WizardGang Portfolio");
  assert.match(version.commit, /^(?:[0-9a-f]{12}|development)$/);
  assert.ok(Number.isFinite(Date.parse(version.builtAt)), "version.json must contain an ISO build timestamp");
  for (const relative of canonicalFiles) {
    const html = await readDist(relative);
    const buildLink = anchorWithHref(html, "/version.json");
    assert.ok(buildLink, `${relative}: missing version evidence link`);
    assert.match(textContent(buildLink.inner), /^Build (?:[0-9a-f]{12}|development)$/);
  }
});

test("favicon retains the current two-color WizardGang mark without freezing SVG serialization", async () => {
  const favicon = await readDist("favicon.svg");
  const rects = startTags(favicon, "rect");
  const fills = new Set(rects.map(({ attrs }) => attrs.get("fill")));
  assert.ok(rects.length >= 2);
  assert.ok(fills.has("#d9ff43"));
  assert.ok(fills.has("#a489ff"));
});

test("homepage preserves the current substantive positioning and primary relationships", async () => {
  const home = await readDist("index.html");
  requireText(home, [
    "Jacob <span>Yongue</span>",
    "I build systems that ship.",
    "Software engineer · Systems · Project delivery",
    "I design, build, connect, and launch software, then help teams keep it working in production.",
    "Selected projects",
    "Selected work",
    "Capabilities",
    "About"
  ], "homepage");
  rejectText(home, [
    "Two bodies of work",
    "Different contexts. Clear boundaries.",
    "Independent build lab",
    "About WizardGang",
    "plain-language-summary",
    "What I do, without the technical shorthand",
    "selected-services",
    "View services",
    "services-teaser-copy"
  ], "homepage");
  assert.ok(anchorWithHref(home, "https://github.com/Wizard-Gang"), "homepage must retain the organization GitHub destination");
  assert.ok(findAnchor(home, (anchor) => anchor.href === "/projects/" && /View projects/i.test(textContent(anchor.inner))));
  assert.ok(findAnchor(home, (anchor) => anchor.href === "mailto:jacob@wizardgang.ai" && /Get in touch/i.test(textContent(anchor.inner))));
  const hero = tagBlocks(home, "section").find(({ attrs }) => (attrs.get("class") || "").split(/\s+/).includes("jacob-hero"));
  assert.ok(hero, "homepage hero section is missing");
  assert.deepEqual(anchors(hero.inner).map((anchor) => anchor.href).sort(), ["/projects/", "mailto:jacob@wizardgang.ai"].sort(), "homepage hero must retain only its current two actions");
  assert.ok(home.indexOf("<h1") < home.indexOf("<h2"), "homepage h1 must precede h2 content");
  assert.ok(home.indexOf("<h1") < home.indexOf("I build systems that ship."), "identity h1 must precede the tagline");
  const decorative = startTags(home, "div").filter(({ attrs }) => attrs.get("aria-hidden") === "true" && attrs.has("inert"));
  assert.equal(decorative.length, 3, "all three homepage project previews remain decorative and inert");
  assert.match(home, /accessible interfaces/i);
  assert.match(home, /accessible controls/i);
});

test("projects preserve source, live, evidence, overview, case-study, and preview relationships", async () => {
  const overview = await readDist("projects/index.html");
  for (const name of ["SharkTank", "Hexframe", "YarReader"]) assert.match(overview, new RegExp(name, "i"));
  for (const label of ["Shark Tank gameplay", "Hexframe training mode", "YarReader sample library"]) {
    assert.ok(startTags(overview, "div").some(({ attrs }) => (attrs.get("aria-label") || "").includes(label)), `projects overview missing semantic preview: ${label}`);
  }
  const decorative = startTags(overview, "div").filter(({ attrs }) => attrs.get("aria-hidden") === "true" && attrs.has("inert"));
  assert.equal(decorative.length, 3, "project previews must remain decorative and inert");

  for (const [slug, relationships] of Object.entries(PROJECT_LINKS)) {
    const projectOverview = await readDist(`projects/${slug}/index.html`);
    const caseStudy = await readDist(`projects/${slug}/case-study/index.html`);
    assert.ok(anchorWithHref(projectOverview, `/projects/${slug}/case-study/`), `${slug} overview must link to its case study`);
    assert.ok(anchorWithHref(caseStudy, `/projects/${slug}/`), `${slug} case study must link back to its overview`);
    for (const html of [projectOverview, caseStudy]) assert.ok(anchorWithHref(html, relationships.source), `${slug} must expose its source repository`);
    if (relationships.live) {
      for (const html of [projectOverview, caseStudy]) assert.ok(anchorWithHref(html, relationships.live), `${slug} must expose its live application`);
    }
    if (relationships.evidence) {
      assert.ok(anchorWithHref(caseStudy, relationships.evidence), `${slug} case study must expose its operating evidence`);
    }
    if (!relationships.live) {
      assert.ok(!anchors(projectOverview).some((anchor) => /^Play\b/i.test(textContent(anchor.inner))), `${slug} must not invent a live URL`);
    }
  }
});

test("canonical project data retains the source/live/evidence contract", () => {
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  for (const [slug, relationships] of Object.entries(PROJECT_LINKS)) {
    const project = bySlug.get(slug);
    assert.ok(project, `missing project data for ${slug}`);
    assert.equal(project.sourceUrl, relationships.source);
    assert.equal(project.liveUrl, relationships.live);
    if (relationships.evidence) assert.equal(project.operationsUrl, relationships.evidence);
    else assert.equal(project.operationsUrl, undefined);
  }
});

test("SharkTank substantive case-study baseline remains intact", async () => {
  const html = await readDist("projects/sharktank/case-study/index.html");
  requireText(html, [
    "It starts with multiplayer gameplay",
    "ISO/IEC 27001",
    "ISO/IEC 42001",
    "The application code is 100% AI-generated",
    "100% uptime maintained",
    "Billable actions",
    "Policies and evidence",
    "WCAG 2.0 AA",
    "Jacob operates Shark Tank"
  ], "SharkTank case study");
  rejectText(html, [
    "These sharks follow rules, not a trained AI model",
    "Computer sharks exist only to fill empty seats",
    "computer-controlled sharks are ordinary game logic",
    "The policies and evidence explain how the game is developed and operated",
    "incidents can happen"
  ], "SharkTank case study");
});

test("Hexframe substantive deterministic, lab, replay, and accessibility baseline remains intact", async () => {
  const html = await readDist("projects/hexframe/case-study/index.html");
  requireText(html, [
    "Make every feature agree on what happened",
    "A playable training stage with one fighter and one practice dummy",
    "Freeze automatically when a hit connects",
    "Graphics show the fight; game rules decide it",
    "The lab supports different controls and display needs",
    "WCAG 2.0 AA",
    "Keyboard and gamepad controls",
    "Reduced motion",
    "Screen-reader messages",
    "Save a position, capture its inputs, and replay the same scenario"
  ], "Hexframe case study");
  rejectText(html, ["A complete path, not an isolated component", "Explicit ownership at every boundary", "The part worth looking at twice", "What exists now"], "Hexframe case study");
});

test("YarReader substantive offline, ingestion, addressing, recovery, and rebuild baseline remains intact", async () => {
  const overview = await readDist("projects/yarreader/index.html");
  const html = await readDist("projects/yarreader/case-study/index.html");
  requireText(html, [
    "Each part has one job",
    "Do the hard work before the reader opens",
    "A library that can recover and be rebuilt",
    "digital fingerprint",
    "Readers for six common source types, including comic archives, ebooks, PDFs, and image folders",
    "A work journal that lets long copy and archive jobs continue after a crash",
    "the finished reader needs no server"
  ], "YarReader case study");
  assert.ok(startTags(overview, "div").some(({ attrs }) => attrs.get("data-fixture") === "synthetic"));
  assert.match(overview, /Original demo artwork/);
  assert.match(await readDist("assets/styles.css"), /url\(["']\/yarreader-library-art\.jpg["']\)/);
  rejectText(html, ["A complete path, not an isolated component", "Explicit ownership at every boundary", "The part worth looking at twice", "What exists now"], "YarReader case study");
});

test("work page preserves career, systems, integrations, deployments, and named examples", async () => {
  const work = await readDist("work/index.html");
  requireText(work, [
    "Career history",
    "Systems delivered",
    "Integrations",
    "Deployments",
    "Real systems in real operations.",
    "Systems organized by what they do.",
    "Enterprise, warehouse, logistics, commerce, development, and automation platforms integrated into production workflows.",
    "Organization links are provided for identification only.",
    "Axon",
    "LexisNexis",
    "CIMS WMS",
    "ERP Integrations",
    "Commerce &amp; Fulfillment",
    "Warehouse Automation",
    "Carrier Integrations",
    "EDI &amp; B2B",
    "Justice &amp; Legal",
    "Shadow Money Wizard Gang",
    "Sep 2024 - Apr 2026",
    "Jun 2023 - Aug 2024"
  ], "work page");
  for (const href of ["https://www.axon.com/", "https://www.lexisnexis.com/en-us/", "https://cloudimsystems.com/"]) {
    assert.ok(anchorWithHref(work, href), `work page missing integration relationship ${href}`);
  }
  rejectText(work, [
    "Grouped by the problem and operating environment",
    "Selected examples from each category",
    "Selected deployment context from Jacob’s employment history",
    "All integrations",
    "All deployments",
    "All core skills",
    "work-disclosure",
    "Education &amp; certification",
    "Clemson University",
    "Independent venture",
    "Oct 2024 - Apr 2026",
    "Nov 2023 - Sep 2024"
  ], "work page");
});

test("services page preserves the current package, ownership, and handoff model", async () => {
  const services = await readDist("services/index.html");
  requireText(services, [
    "Launch the site",
    "Keep the keys",
    "The website is yours",
    "Your website. Your code. Your infrastructure.",
    "No required monthly hosting subscription for qualifying sites",
    "Built to be handed over",
    "Add infrastructure when the business needs it",
    "Starter",
    "$95",
    "Business",
    "$195",
    "Owner+",
    "$350",
    "Up to 3 pages",
    "Up to 5 pages",
    "Up to 8 pages",
    "History and checks",
    "I don’t sell you a website subscription",
    "I build you a small piece of software",
    "I can build, configure, test, and launch the site",
    "I do not have to stay in the middle"
  ], "services page");
  rejectText(services, [
    "We don’t sell",
    "We build you",
    "WizardGang can build",
    "WizardGang does not have to stay",
    "$0 hosting forever",
    "$0/month forever",
    "yourwebsite.wizardgang.ai",
    "Live example",
    "Open the demo",
    "service-demo",
    "service-source-map"
  ], "services page");
});

test("about and glossary retain their current substantive roles", async () => {
  const about = await readDist("about/index.html");
  requireText(about, ["About Jacob Yongue", "Systems thinking", "Implementation depth", "Project ownership", "Learning velocity"], "about page");
  rejectText(about, ["WizardGang.ai is my personal engineering portfolio", "Let’s talk about the system", "Professional work</a>"], "about page");

  const glossary = await readDist("glossary/index.html");
  requireText(glossary, ["Technical terms.", "Artificial intelligence (AI)", "Application programming interface (API)", "Web Content Accessibility Guidelines (WCAG)"], "glossary page");
});

test("canonical sitemap inventory is exact and excludes 404 and compatibility routes", async () => {
  const sitemap = await readDist("sitemap.xml");
  const routes = tagBlocks(sitemap, "loc").map(({ inner }) => {
    const url = new URL(textContent(inner));
    assert.equal(url.origin, ORIGIN);
    return url.pathname;
  });
  assert.deepEqual(routes, SITEMAP_ROUTES);
  assert.ok(!routes.includes("/404/"));
});

test("production security headers remain authoritative in public/_headers", async () => {
  const source = await readRoot("public/_headers");
  assert.match(source, /Strict-Transport-Security:\s*max-age=31536000; includeSubDomains/i);
  assert.match(source, /Content-Security-Policy:[^\n]*upgrade-insecure-requests/i);
  assert.match(source, /X-Content-Type-Options:\s*nosniff/i);
  assert.match(source, /X-Frame-Options:\s*DENY/i);
  assert.match(source, /Cache-Control:\s*public, max-age=0, must-revalidate, no-transform/i);
  assert.equal(await readDist("_headers"), source, "a production build must copy the production header authority unchanged");
});

test("local header sanitization removes only HTTPS-only directives from the production authority", async () => {
  const source = await readRoot("public/_headers");
  const sanitized = sanitizeLocalHeadersText(source);
  assert.doesNotMatch(sanitized, /Strict-Transport-Security/i);
  assert.doesNotMatch(sanitized, /upgrade-insecure-requests/i);
  for (const header of [
    "Content-Security-Policy: default-src 'none'",
    "X-Content-Type-Options: nosniff",
    "X-Frame-Options: DENY",
    "Referrer-Policy: strict-origin-when-cross-origin",
    "Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy: same-origin",
    "Cache-Control: public, max-age=0, must-revalidate, no-transform"
  ]) assert.ok(sanitized.includes(header), `local sanitization removed security behavior: ${header}`);
  assert.equal(await readRoot("public/_headers"), source, "sanitization must never mutate public/_headers");
});

test("portfolio boundary remains static and retired compliance application routes stay absent", async () => {
  assert.equal(await exists(resolve(dist, "compliance/index.html")), false);
  assert.equal(await exists(resolve(dist, "security/index.html")), false);
  const worker = await readRoot("src/worker/index.ts");
  assert.doesNotMatch(worker, /DurableObject|\bD1\b|\bR2\b|authentication|OPS_TOKEN/);
  assert.match(worker, /sharktank\.wizardgang\.ai/);
  const siteSource = await readRoot("src/site.mjs");
  assert.doesNotMatch(siteSource, /function compliance\(|compliance\/index\.html|WCAG_LEVELS|ISO_STANDARDS/);
  assert.doesNotMatch(await readDist("assets/site.js"), /Compliance — WizardGang|class=["']compliance-/);
});

test("WG-038 establishes the frontend toolchain without transferring production authority", async () => {
  const pkg = JSON.parse(await readRoot("package.json"));
  const dependencies = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  for (const name of ["typescript", "react", "react-dom", "vite", "@vitejs/plugin-react", "tailwindcss", "@tailwindcss/vite", "@types/react", "@types/react-dom"]) {
    assert.ok(dependencies[name], `WG-038 must declare ${name}`);
  }
  for (const name of ["react-router", "next", "remix", "@tanstack/react-start", "astro", "@cloudflare/vite-plugin"]) {
    assert.equal(dependencies[name], undefined, `WG-038 must not introduce ${name}`);
  }

  assert.equal(pkg.scripts.build, "node scripts/build.mjs", "legacy generated-site build must remain production authority");
  assert.equal(pkg.scripts.dev, "node scripts/dev.mjs", "normal local-development entry point must remain unchanged");
  assert.equal(pkg.scripts["build:frontend"], "vite build --config vite.config.ts");
  assert.match(pkg.scripts["check:frontend"] || "", /typecheck/);
  assert.match(pkg.scripts.check || "", /check:frontend/);

  assert.equal(await exists(resolve(root, "tsconfig.json")), true);
  assert.equal(await exists(resolve(root, "vite.config.ts")), true);
  assert.equal(await exists(resolve(root, "src/app/foundation/main.tsx")), true);
  assert.equal(await exists(resolve(root, "src/styles/globals.css")), true);

  const wrangler = await readRoot("wrangler.jsonc");
  assert.match(wrangler, /"main":\s*"src\/worker\/index\.ts"/);
  assert.match(wrangler, /"directory":\s*"\.\/dist"/);
});

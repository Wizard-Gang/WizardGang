import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import test from "node:test";
import { projects } from "../src/data/projects.ts";
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

function browserModulePath(html) {
  const modules = startTags(html, "script").filter(({ attrs }) => attrs.get("type") === "module");
  assert.equal(modules.length, 1, "page must load exactly one TypeScript browser module");
  const source = modules[0].attrs.get("src") || "";
  assert.match(source, /^\/assets\/browser-[A-Za-z0-9_-]+\.js$/, "browser module must use the Vite hashed asset contract");
  return source.slice(1);
}

test("generated HTML inventory is the explicit 18-page canonical contract", async () => {
  const actual = (await walk(dist))
    .filter((path) => path.endsWith(".html"))
    .map(relativeFromDist)
    .sort();
  assert.deepEqual(actual, [...canonicalFiles].sort());
  assert.equal(actual.length, 18);
});

test("all required public build artifacts and public records exist", async () => {
  const artifacts = [
    "_headers",
    "assets/styles.css",
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
  const browserAssets = (await walk(resolve(dist, "assets")))
    .map(relativeFromDist)
    .filter((file) => /^assets\/browser-[A-Za-z0-9_-]+\.js$/.test(file));
  assert.equal(browserAssets.length, 1, "build must emit exactly one hashed TypeScript browser entry");
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
      assert.equal(scripts.length, 1, "must load exactly one first-party browser module");
      assert.equal(scripts[0].attrs.get("type"), "module");
      assert.equal(scripts[0].attrs.get("src"), `/${browserModulePath(html)}`);
      assert.equal(textContent(scripts[0].inner), "", "inline JavaScript is not allowed");
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
  for (const relative of ["index.html", "software/index.html", "software/integrations/index.html", "solutions/index.html"]) {
    const html = await readDist(relative);
    assert.equal(metaContent(html, "property", "og:image"), `${ORIGIN}/og.jpg`);
    assert.equal(metaContent(html, "property", "og:image:type"), "image/jpeg");
    assert.equal(metaContent(html, "property", "og:image:width"), "1200");
    assert.equal(metaContent(html, "property", "og:image:height"), "630");
    assert.match(metaContent(html, "property", "og:image:alt") || "", /WizardGang/i);
    assert.equal(metaContent(html, "name", "twitter:card"), "summary_large_image");
    assert.equal(metaContent(html, "name", "twitter:image"), `${ORIGIN}/og.jpg`);
  }

  for (const relative of canonicalFiles.filter((file) => !["index.html", "software/index.html", "software/integrations/index.html", "solutions/index.html"].includes(file))) {
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

test("homepage is WizardGang-first while routing to current deeper authorities", async () => {
  const home = await readDist("index.html");
  requireText(home, [
    "Build software.",
    "Make it inspectable.",
    "Working systems with source and evidence.",
    "Integration capability with clear attribution.",
    "employer and customer evidence remains attributed",
    "Reusable approaches, separate from products.",
    "Company &amp; team",
    "Software with clear ownership.",
    "SharkTank",
    "Hexframe",
    "YarReader"
  ], "homepage");
  rejectText(home, [
    "Jacob <span>Yongue</span>",
    "I build systems that ship.",
    "Software engineer · Systems · Project delivery",
    "Selected work",
    "Systems delivered in real operations.",
    "From idea to production."
  ], "homepage");

  const title = textContent(tagBlocks(home, "title")[0].inner);
  assert.match(title, /^WizardGang\b/);
  assert.doesNotMatch(title, /Jacob Yongue/i);
  const description = metaContent(home, "name", "description") || "";
  assert.match(description, /^WizardGang\b/);
  assert.doesNotMatch(description, /portfolio/i);
  assert.equal(linkByRel(home, "canonical")?.attrs.get("href"), `${ORIGIN}/`);

  const h1 = tagBlocks(home, "h1");
  assert.equal(h1.length, 1);
  assert.equal(textContent(h1[0].inner), "Build software. Make it inspectable.");

  const hero = tagBlocks(home, "section").find(({ attrs }) => (attrs.get("class") || "").split(/\s+/).includes("hero"));
  assert.ok(hero, "homepage hero section is missing");
  assert.deepEqual(anchors(hero.inner).map((anchor) => anchor.href).sort(), ["/software/", "/solutions/"].sort());

  for (const href of ["/software/", "/software/integrations/", "/software/projects/", "/about/team/jacob/", "/solutions/", "/services/", "/about/", "https://demo.wizardgang.ai", "mailto:jacob@wizardgang.ai"]) {
    assert.ok(anchorWithHref(home, href), `homepage missing current destination ${href}`);
  }
  assert.ok(anchorWithHref(home, "https://github.com/Wizard-Gang"), "homepage must retain organization GitHub access through shared chrome");
  assert.doesNotMatch(home, /selected-work-grid/, "homepage must not recreate career-history cards");

  assert.ok(home.indexOf("<h1") < home.indexOf("<h2"), "homepage h1 must precede h2 content");
  const decorative = startTags(home, "div").filter(({ attrs }) => attrs.get("aria-hidden") === "true" && attrs.has("inert"));
  assert.equal(decorative.length, 3, "all three homepage project previews remain decorative and inert");
  assert.match(home, /accessible interfaces/i);
  assert.match(home, /accessible controls/i);
});

test("projects preserve source, live, evidence, overview, case-study, and preview relationships", async () => {
  const overview = await readDist("software/projects/index.html");
  for (const name of ["SharkTank", "Hexframe", "YarReader"]) assert.match(overview, new RegExp(name, "i"));
  for (const label of ["Shark Tank gameplay", "Hexframe training mode", "YarReader sample library"]) {
    assert.ok(startTags(overview, "div").some(({ attrs }) => (attrs.get("aria-label") || "").includes(label)), `projects overview missing semantic preview: ${label}`);
  }
  const decorative = startTags(overview, "div").filter(({ attrs }) => attrs.get("aria-hidden") === "true" && attrs.has("inert"));
  assert.equal(decorative.length, 3, "project previews must remain decorative and inert");

  for (const [slug, relationships] of Object.entries(PROJECT_LINKS)) {
    const projectOverview = await readDist(`software/projects/${slug}/index.html`);
    const caseStudy = await readDist(`software/projects/${slug}/case-study/index.html`);
    assert.ok(anchorWithHref(projectOverview, `/software/projects/${slug}/case-study/`), `${slug} overview must link to its case study`);
    assert.ok(anchorWithHref(caseStudy, `/software/projects/${slug}/`), `${slug} case study must link back to its overview`);
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
  const html = await readDist("software/projects/sharktank/case-study/index.html");
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
  const html = await readDist("software/projects/hexframe/case-study/index.html");
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
  const overview = await readDist("software/projects/yarreader/index.html");
  const html = await readDist("software/projects/yarreader/case-study/index.html");
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
  assert.match(await readDist("assets/styles.css"), /url\((?:["'])?\/yarreader-library-art\.jpg(?:["'])?\)/);
  rejectText(html, ["A complete path, not an isolated component", "Explicit ownership at every boundary", "The part worth looking at twice", "What exists now"], "YarReader case study");
});

test("Jacob Team page preserves attributed career and integration evidence without duplicating the company catalog", async () => {
  const jacob = await readDist("about/team/jacob/index.html");
  requireText(jacob, [
    "Professional background",
    "Career history",
    "Professional integration evidence",
    "Experience stays attributed to the roles that produced it.",
    "ERP and WMS integration work",
    "REST/JSON APIs",
    "SAML/SSO",
    "EDI",
    "ETL and data pipelines",
    "Deployments",
    "Organization links are provided for identification only.",
    "Shadow Money Wizard Gang",
    "Sep 2024 - Apr 2026",
    "Jun 2023 - Aug 2024",
    "Explore WizardGang integration capability"
  ], "Jacob Team page");
  rejectText(jacob, [
    "NetSuite",
    "Microsoft Dynamics",
    "Fishbowl",
    "Blue Yonder",
    "Axon",
    "LexisNexis",
    "CIMS WMS",
    "ERP Integrations",
    "Commerce &amp; Fulfillment",
    "Warehouse Automation",
    "Carrier Integrations",
    "EDI &amp; B2B",
    "Justice &amp; Legal",
    "All integrations",
    "work-disclosure",
    "Education &amp; certification",
    "Clemson University",
    "Oct 2024 - Apr 2026",
    "Nov 2023 - Sep 2024"
  ], "Jacob Team page");
  assert.ok(anchorWithHref(jacob, "/software/integrations/"), "Jacob Team page must link to the canonical integration capability");
  assert.equal(await exists(resolve(dist, "work/index.html")), false, "redirect-only /work/ must not generate HTML");
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

test("About hierarchy and glossary retain their current substantive roles", async () => {
  const about = await readDist("about/index.html");
  requireText(about, ["About WizardGang", "Company and people,", "About the company", "Meet the team"], "about landing");

  const company = await readDist("about/company/index.html");
  requireText(company, ["WizardGang company", "Software first.", "Keep ownership explicit.", "Demonstrate; do not overclaim."], "company page");
  rejectText(company, ["University of Georgia", "Supply Chain Technologies", "Career history", "Deployments"], "company page");

  const team = await readDist("about/team/index.html");
  requireText(team, ["WizardGang team", "One real member. No placeholders.", "Jacob Yongue", "View Jacob"], "team page");
  rejectText(team, ["Career history", "Systems delivered", "Deployments"], "team page");

  const jacob = await readDist("about/team/jacob/index.html");
  requireText(jacob, ["Team / Jacob Yongue", "Systems thinking", "Implementation depth", "Project ownership", "Learning velocity", "Professional background", "Career history", "Professional integration evidence", "Deployments"], "Jacob team page");

  const glossary = await readDist("glossary/index.html");
  requireText(glossary, ["Technical terms.", "Artificial intelligence (AI)", "Application programming interface (API)", "Web Content Accessibility Guidelines (WCAG)"], "glossary page");
});

test("canonical pages do not link to career compatibility redirects", async () => {
  for (const relative of canonicalFiles) {
    const html = await readDist(relative);
    for (const anchor of anchors(html)) {
      const path = anchor.href.split(/[?#]/)[0];
      assert.ok(!["/work", "/work/", "/resume", "/resume/", "/professional", "/professional/"].includes(path), `${relative} links to redirect-only career route ${anchor.href}`);
    }
  }
});

test("canonical pages do not link through legacy project redirects", async () => {
  for (const relative of canonicalFiles) {
    const html = await readDist(relative);
    for (const anchor of anchors(html)) {
      const path = anchor.href.split(/[?#]/)[0];
      assert.ok(path !== "/projects" && !path.startsWith("/projects/"), `${relative} links to redirect-only project route ${anchor.href}`);
    }
  }
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
  assert.equal(await exists(resolve(root, "src/site.mjs")), false);
  const home = await readDist("index.html");
  assert.doesNotMatch(await readDist(browserModulePath(home)), /Compliance — WizardGang|class=["']compliance-/);
});

test("React frontend toolchain owns the shared production shell without becoming an SPA", async () => {
  const pkg = JSON.parse(await readRoot("package.json"));
  const dependencies = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  for (const name of ["typescript", "react", "react-dom", "vite", "@vitejs/plugin-react", "tailwindcss", "@tailwindcss/vite", "@types/react", "@types/react-dom"]) {
    assert.ok(dependencies[name], `frontend toolchain must retain ${name}`);
  }
  for (const name of ["react-router", "next", "remix", "@tanstack/react-start", "astro", "@cloudflare/vite-plugin"]) {
    assert.equal(dependencies[name], undefined, `WG-041 must not introduce ${name}`);
  }

  assert.equal(pkg.scripts.build, "node scripts/build.mjs");
  assert.equal(pkg.scripts.dev, "node scripts/dev.mjs");
  assert.equal(pkg.scripts["build:frontend"], undefined, "duplicate frontend build alias must stay retired");
  assert.match(pkg.scripts["check:frontend"] || "", /typecheck/);
  assert.match(pkg.scripts["check:frontend"] || "", /verify-react-shell/);
  assert.match(pkg.scripts.check || "", /check:frontend/);

  for (const file of ["tsconfig.json", "vite.config.ts", "src/app/Document.tsx", "src/app/contracts.ts", "src/components/SiteChrome.tsx", "src/styles/globals.css"]) {
    assert.equal(await exists(resolve(root, file)), true, `missing frontend authority ${file}`);
  }
  assert.equal(await exists(resolve(root, "src/app/foundation/main.tsx")), false, "WG-038 proof harness must be retired");

  const documentSource = await readRoot("src/app/Document.tsx");
  assert.match(documentSource, /renderToStaticMarkup/);
  assert.doesNotMatch(documentSource, /react-dom\/client|hydrateRoot|createRoot/);

  for (const path of [
    "src/site.mjs",
    "src/projects.mjs",
    "src/professional.mjs",
    "src/professional-systems.mjs",
    "public/assets/site.js",
    "src/styles.css",
    "src/portfolio-cleanup.css",
    "src/pages/Work.tsx"
  ]) {
    assert.equal(await exists(resolve(root, path)), false, `retired frontend source returned: ${path}`);
  }

  const stylesSource = await readRoot("src/styles/globals.css");
  assert.match(stylesSource, /tailwindcss\/theme\.css/);
  assert.match(stylesSource, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);

  const registrySource = await readRoot("src/app/pageRegistry.ts");
  assert.match(registrySource, /createStaticPageRegistry/);
  for (const authority of ["HOME_PAGE", "SERVICES_PAGE", "ABOUT_PAGE", "COMPANY_PAGE", "TEAM_PAGE", "JACOB_TEAM_PAGE", "SOFTWARE_PAGE", "SOFTWARE_INTEGRATIONS_PAGE", "SOLUTIONS_PAGE", "GLOSSARY_PAGE", "NOT_FOUND_PAGE", "createProjectPageDefinitions"]) {
    assert.ok(registrySource.includes(authority), `React page registry missing ${authority}`);
  }
  assert.doesNotMatch(registrySource, /createWorkPageDefinitions|pages\/Work/, "redirect-only Work must stay out of the React registry");

  const vite = await readRoot("vite.config.ts");
  assert.match(vite, /ssr:\s*"src\/app\/Document\.tsx"/);
  assert.match(vite, /wizardgang-static-react-shell/);
  assert.match(vite, /tmp\/frontend-shell/);

  const wrangler = await readRoot("wrangler.jsonc");
  assert.match(wrangler, /"main":\s*"src\/worker\/index\.ts"/);
  assert.match(wrangler, /"directory":\s*"\.\/dist"/);
});

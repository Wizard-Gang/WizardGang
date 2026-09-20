import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { NAVIGATION_ITEMS, navigationSectionForPath } from "../src/app/navigation.ts";
import { INTEGRATIONS_PATH, integrationCategories } from "../src/data/integrations.ts";
import {
  PROJECTS_ROOT_PATH,
  projectCaseStudyPath,
  projectPath,
  projects
} from "../src/data/projects.ts";
import {
  DEMO_FRAMEWORK_PATH,
  DEMO_FRAMEWORK_URL,
  SOLUTIONS_ROOT_PATH,
  WEBSITES_SOLUTION_PATH,
  solutions
} from "../src/data/solutions.ts";
import { TEAM_MEMBERS } from "../src/data/team.ts";
import { professionalRoles } from "../src/data/professional.ts";
import { PERMANENT_REDIRECTS } from "../src/worker/index.ts";
import {
  anchors,
  generatedHtmlFiles,
  linkByRel,
  metaContent,
  readDist,
  readRoot,
  tagBlocks,
  textContent,
  walk
} from "./helpers.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const ORIGIN = "https://wizardgang.ai";
const PRIMARY_NAVIGATION = [
  { key: "about", href: "/about/", label: "About" },
  { key: "software", href: "/software/", label: "Software" },
  { key: "solutions", href: "/solutions/", label: "Solutions" }
];

const fixedCanonicalRoutes = [
  "/",
  "/about/",
  "/about/company/",
  "/about/team/",
  "/software/",
  INTEGRATIONS_PATH,
  PROJECTS_ROOT_PATH,
  SOLUTIONS_ROOT_PATH,
  "/glossary/"
];

function expectedCanonicalRoutes() {
  return new Set([
    ...fixedCanonicalRoutes,
    ...TEAM_MEMBERS.map((member) => member.profilePath),
    ...projects.flatMap((project) => [
      projectPath(project.slug),
      ...(project.caseStudy ? [projectCaseStudyPath(project.slug)] : [])
    ]),
    ...solutions.map((solution) => solution.path)
  ]);
}

async function generatedCanonicalRoutes() {
  const routes = new Map();
  for (const relative of await generatedHtmlFiles()) {
    const html = await readDist(relative);
    const canonical = linkByRel(html, "canonical")?.attrs.get("href");
    if (!canonical) {
      assert.equal(relative, "404.html", `${relative} is generated without canonical metadata`);
      assert.match(metaContent(html, "name", "robots") || "", /noindex/i);
      continue;
    }
    const url = new URL(canonical);
    assert.equal(url.origin, ORIGIN, `${relative} canonical escaped the WizardGang origin`);
    assert.equal(url.search, "", `${relative} canonical identity must not include a query string`);
    assert.equal(url.hash, "", `${relative} canonical identity must not include a fragment`);
    routes.set(relative, url.pathname);
  }
  return routes;
}

function sorted(values) {
  return [...values].sort();
}

test("generated canonical route inventory exactly matches the approved company-first IA", async () => {
  const expected = expectedCanonicalRoutes();
  const generated = await generatedCanonicalRoutes();
  const files = await generatedHtmlFiles();

  assert.deepEqual(sorted(generated.values()), sorted(expected), "canonical route inventory drifted from the approved company-first IA");
  assert.equal(files.length, expected.size + 1, "generated HTML must contain exactly the canonical pages plus the noindex 404");

  for (const source of PERMANENT_REDIRECTS.keys()) {
    assert.equal(expected.has(source), false, `compatibility route must not be canonical: ${source}`);
  }

  for (const [source, destination] of PERMANENT_REDIRECTS) {
    if (!destination.startsWith("/")) continue;
    assert.ok(expected.has(destination), `compatibility route ${source} must point directly to a canonical route; found ${destination}`);
    assert.equal(PERMANENT_REDIRECTS.has(destination), false, `compatibility route ${source} creates a redirect chain through ${destination}`);
  }

  for (const retired of ["work/index.html", "projects/index.html", "services/index.html", "professional/index.html", "resume/index.html", "contact/index.html"]) {
    await assert.rejects(readDist(retired), { code: "ENOENT" }, `retired output unexpectedly returned: ${retired}`);
  }
});

test("primary navigation remains one typed company-first authority", async () => {
  assert.deepEqual(NAVIGATION_ITEMS, PRIMARY_NAVIGATION);
  assert.equal(navigationSectionForPath("/about/team/jacob/"), "about");
  assert.equal(navigationSectionForPath("/software/projects/sharktank/case-study/"), "software");
  assert.equal(navigationSectionForPath("/solutions/demo-framework/"), "solutions");
  for (const retired of ["/projects/", "/work/", "/services/", "/professional/", "/resume/"]) {
    assert.equal(navigationSectionForPath(retired), "", `compatibility path must not own a primary section: ${retired}`);
  }

  const chrome = await readRoot("src/components/SiteChrome.tsx");
  assert.match(chrome, /import \{ NAVIGATION_ITEMS \} from "\.\.\/app\/navigation"/);
  assert.match(chrome, /<Navigation current=\{current\} \/>/);
  assert.match(chrome, /<Navigation current=\{current\} mobile/);
  assert.equal((chrome.match(/NAVIGATION_ITEMS\.map/g) || []).length, 1, "desktop and mobile navigation must render from one shared typed map");

  const navigationDefinitions = [];
  for (const path of await walk(resolve(root, "src"))) {
    if (!/\.(?:ts|tsx)$/.test(path)) continue;
    const source = await readFile(path, "utf8");
    if (/export const NAVIGATION_ITEMS\s*=/.test(source)) navigationDefinitions.push(path);
  }
  assert.equal(navigationDefinitions.length, 1, "production source must define exactly one global navigation authority");
  assert.ok(navigationDefinitions[0].endsWith("/src/app/navigation.ts"));
});

test("Home remains WizardGang-first and routes directly into the company hierarchy", async () => {
  const html = await readDist("index.html");
  const title = textContent(tagBlocks(html, "title")[0]?.inner || "");
  const h1 = textContent(tagBlocks(html, "h1")[0]?.inner || "");
  const plain = textContent(html);
  const hrefs = new Set(anchors(html).map((anchor) => anchor.href));

  assert.match(title, /^WizardGang\b/);
  assert.match(plain, /WizardGang builds and publishes practical software/);
  assert.doesNotMatch(h1, /Jacob|I build/i);
  assert.doesNotMatch(plain, /I build systems that ship|Software engineer · Systems · Project delivery|Selected work/);

  for (const href of ["/about/", "/about/company/", "/about/team/", "/software/", INTEGRATIONS_PATH, PROJECTS_ROOT_PATH, SOLUTIONS_ROOT_PATH, WEBSITES_SOLUTION_PATH, DEMO_FRAMEWORK_PATH]) {
    assert.ok(hrefs.has(href), `Home must link directly to canonical IA destination ${href}`);
  }
  for (const project of projects) {
    assert.ok(hrefs.has(projectPath(project.slug)), `Home must project ${project.name} from the canonical project authority`);
  }
});

test("About keeps Company, Team, and professional ownership separated", async () => {
  const expected = expectedCanonicalRoutes();
  for (const route of ["/about/", "/about/company/", "/about/team/", ...TEAM_MEMBERS.map((member) => member.profilePath)]) {
    assert.ok(expected.has(route), `missing About-family canonical route ${route}`);
  }

  const about = await readDist("about/index.html");
  const aboutHrefs = new Set(anchors(about).map((anchor) => anchor.href));
  assert.ok(aboutHrefs.has("/about/company/"));
  assert.ok(aboutHrefs.has("/about/team/"));

  const company = textContent(await readDist("about/company/index.html"));
  assert.match(company, /WizardGang is a software organization/);
  assert.match(company, /Employer and customer history is not presented as WizardGang client work/);

  const team = await readDist("about/team/index.html");
  for (const member of TEAM_MEMBERS) {
    assert.ok(textContent(team).includes(member.name));
    assert.ok(anchors(team).some((anchor) => anchor.href === member.profilePath));
  }

  const jacob = textContent(await readDist("about/team/jacob/index.html"));
  for (const role of professionalRoles) {
    assert.ok(jacob.includes(role.organization), `professional authority is missing role organization ${role.organization}`);
  }

  const aboutSource = await readRoot("src/pages/About.tsx");
  assert.match(aboutSource, /professionalRoles/);
  assert.match(aboutSource, /professionalSkills/);
  assert.match(aboutSource, /deployments/);

  for (const path of ["src/pages/Home.tsx", "src/pages/CompanyNavigation.tsx", "src/pages/Projects.tsx", "src/pages/Solutions.tsx"]) {
    const source = await readRoot(path);
    assert.doesNotMatch(source, /from "\.\.\/data\/professional(?:-systems)?"/, `${path} must not become a competing professional-history authority`);
  }

  for (const path of ["src/pages/Work.tsx", "src/data/services.ts", "src/pages/Services.tsx"]) {
    await assert.rejects(access(resolve(root, path)), { code: "ENOENT" }, `retired parallel authority returned: ${path}`);
  }
});

test("Software owns the single integration catalog and canonical WizardGang project catalog", async () => {
  const software = await readDist("software/index.html");
  const softwareHrefs = new Set(anchors(software).map((anchor) => anchor.href));
  assert.ok(softwareHrefs.has(INTEGRATIONS_PATH));
  assert.ok(softwareHrefs.has(PROJECTS_ROOT_PATH));

  const integrations = await readDist("software/integrations/index.html");
  const integrationPlain = textContent(integrations);
  for (const category of integrationCategories) {
    assert.ok(integrationPlain.includes(category.name), `integration authority missing category ${category.name}`);
    assert.ok(integrations.includes(`id="${category.id}"`), `integration authority missing fragment target ${category.id}`);
  }

  const integrationPageSource = await readRoot("src/pages/CompanyNavigation.tsx");
  assert.match(integrationPageSource, /<IntegrationCatalog categories=\{integrationCategories\} \/>/);
  const homeSource = await readRoot("src/pages/Home.tsx");
  assert.doesNotMatch(homeSource, /integrationCategories|IntegrationCatalog/);

  const catalog = await readDist("software/projects/index.html");
  const catalogHrefs = new Set(anchors(catalog).map((anchor) => anchor.href));
  for (const project of projects) {
    const overview = projectPath(project.slug);
    assert.ok(catalogHrefs.has(overview), `project catalog missing canonical project route ${overview}`);
    if (project.caseStudy) {
      const caseStudy = projectCaseStudyPath(project.slug);
      assert.ok(expectedCanonicalRoutes().has(caseStudy), `project case-study route is not canonical: ${caseStudy}`);
    }
  }

  const projectSource = await readRoot("src/pages/Projects.tsx");
  const sharedProjectSource = await readRoot("src/components/ProjectSurfaces.tsx");
  assert.match(projectSource, /createProjectPageDefinitions/);
  assert.match(projectSource, /projectOutputPath/);
  assert.match(projectSource, /projectCaseStudyOutputPath/);
  assert.match(sharedProjectSource, /ProjectCardGrid/);
  assert.match(sharedProjectSource, /projectPath\(project\.slug\)/);
});

test("company-facing catalogs do not present employer history as WizardGang project or capability ownership", async () => {
  const companyFacing = [
    "index.html",
    "software/index.html",
    "software/integrations/index.html",
    "software/projects/index.html",
    "solutions/index.html"
  ];

  for (const relative of companyFacing) {
    const plain = textContent(await readDist(relative));
    for (const role of professionalRoles) {
      assert.ok(!plain.includes(role.organization), `${relative} must not present professional employer ${role.organization} as company catalog content`);
    }
  }
});

test("Solutions stays distinct from Software and keeps Demo Framework depth external", async () => {
  const html = await readDist("solutions/index.html");
  const hrefs = new Set(anchors(html).map((anchor) => anchor.href));
  for (const solution of solutions) {
    assert.ok(hrefs.has(solution.path), `Solutions landing missing canonical solution ${solution.path}`);
    assert.equal(solution.path, `/solutions/${solution.slug}/`);
  }

  assert.equal(DEMO_FRAMEWORK_PATH, "/solutions/demo-framework/");
  assert.equal(WEBSITES_SOLUTION_PATH, "/solutions/websites/");
  assert.equal(PERMANENT_REDIRECTS.get("/services/"), WEBSITES_SOLUTION_PATH);

  const demo = await readDist("solutions/demo-framework/index.html");
  assert.ok(anchors(demo).some((anchor) => anchor.href === DEMO_FRAMEWORK_URL), "Demo Framework must retain the external executable/evidence boundary");
  assert.ok(!anchors(demo).some((anchor) => /^\/solutions\/demo-framework\/(?:security|operations|assurance|interfaces)\//.test(anchor.href)), "main site must not mirror the external demo route tree");

  for (const project of projects) {
    assert.ok(!solutions.some((solution) => solution.slug === project.slug), `project ${project.slug} must not migrate into Solutions authority`);
  }
});

test("sitemap is an exact projection of canonical company-first routes", async () => {
  const expected = expectedCanonicalRoutes();
  const source = await readRoot("public/sitemap.xml");
  const urls = [...source.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));

  assert.equal(urls.length, expected.size, "sitemap count must equal canonical page count excluding 404");
  assert.deepEqual(sorted(urls.map((url) => url.pathname)), sorted(expected));
  assert.equal(new Set(urls.map((url) => url.toString())).size, urls.length, "sitemap must not contain duplicate URLs");

  for (const url of urls) {
    assert.equal(url.origin, ORIGIN);
    assert.equal(url.search, "", "sitemap entries must be path identities, not query alternatives");
    assert.equal(url.hash, "");
    assert.equal(PERMANENT_REDIRECTS.has(url.pathname), false, `sitemap includes compatibility route ${url.pathname}`);
  }
});

test("canonical and Open Graph metadata use the actual company-first route on every canonical page", async () => {
  const generated = await generatedCanonicalRoutes();
  for (const [relative, route] of generated) {
    const html = await readDist(relative);
    const expected = `${ORIGIN}${route}`;
    assert.equal(linkByRel(html, "canonical")?.attrs.get("href"), expected, `${relative} canonical URL drifted`);
    assert.equal(metaContent(html, "property", "og:url"), expected, `${relative} Open Graph URL drifted`);
    assert.doesNotMatch(route, /^\/(?:projects|work|services|professional|resume)(?:\/|$)/, `${relative} metadata points to retired IA`);
  }

  for (const project of projects) {
    assert.ok(generated.has(`software/projects/${project.slug}/index.html`));
    if (project.caseStudy) assert.ok(generated.has(`software/projects/${project.slug}/case-study/index.html`));
  }
  for (const member of TEAM_MEMBERS) {
    assert.ok([...generated.values()].includes(member.profilePath));
  }
});

test("browser-facing internal links never depend on compatibility redirects", async () => {
  const canonical = expectedCanonicalRoutes();
  for (const relative of await generatedHtmlFiles()) {
    const html = await readDist(relative);
    for (const anchor of anchors(html)) {
      if (!anchor.href.startsWith("/")) continue;
      const url = new URL(anchor.href, ORIGIN);
      assert.equal(PERMANENT_REDIRECTS.has(url.pathname), false, `${relative} links through compatibility route ${anchor.href}`);
      if (url.pathname.endsWith("/")) {
        assert.ok(canonical.has(url.pathname), `${relative} links to unexpected page route ${url.pathname}`);
      }
    }
  }

  const sourceRoots = ["src/pages", "src/components", "src/data"];
  for (const sourceRoot of sourceRoots) {
    for (const path of await walk(resolve(root, sourceRoot))) {
      if (!/\.(?:ts|tsx)$/.test(path)) continue;
      const source = await readFile(path, "utf8");
      assert.doesNotMatch(
        source,
        /href=["'`]\/(?:work|projects|services|professional|resume)(?:\/|["'`?#])/,
        `production source contains a compatibility-route UI link: ${path}`
      );
    }
  }
});

test("Footer keeps contact and GitHub contextual without restoring old primary IA", async () => {
  const html = await readDist("index.html");
  const primary = tagBlocks(html, "nav").find(({ attrs }) => attrs.get("aria-label") === "Primary");
  assert.ok(primary);
  const primaryLabels = anchors(primary.inner).map((anchor) => textContent(anchor.inner));
  assert.deepEqual(primaryLabels, ["About", "Software", "Solutions"]);

  const footer = tagBlocks(html, "footer")[0];
  assert.ok(footer);
  const footerAnchors = anchors(footer.inner);
  assert.ok(footerAnchors.some((anchor) => anchor.href === "mailto:jacob@wizardgang.ai"));
  assert.ok(footerAnchors.some((anchor) => anchor.href === "https://github.com/Wizard-Gang"));

  for (const retired of ["/work/", "/projects/", "/services/", "/contact/"]) {
    assert.ok(!footerAnchors.some((anchor) => anchor.href === retired), `Footer restored retired IA destination ${retired}`);
  }
});

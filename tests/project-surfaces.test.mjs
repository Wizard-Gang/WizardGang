import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  PROJECTS_INDEX_METADATA,
  PROJECTS_ROOT_PATH,
  projectActionsFor,
  projectCaseStudyMetadata,
  projectCaseStudyPath,
  projectOverviewMetadata,
  projectPath,
  projectRoutes,
  projects,
  validateProjectRecords
} from "../src/data/projects.ts";
import { CANONICAL_PAGES, PROJECT_LINKS, anchors, linkByRel, readDist, startTags, tagBlocks, textContent } from "./helpers.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const ORIGIN = "https://wizardgang.ai";

test("typed project authority defines a stable, optional presentation contract", () => {
  assert.equal(projects.length, 3);
  assert.deepEqual(projects.map((project) => project.slug), ["sharktank", "hexframe", "yarreader"]);
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  assert.equal(new Set(projects.flatMap((project) => project.preview ? [project.preview.id] : [])).size, projects.filter((project) => project.preview).length);
  assert.equal(PROJECTS_INDEX_METADATA.path, PROJECTS_ROOT_PATH);
  assert.doesNotThrow(() => validateProjectRecords(projects));

  for (const project of projects) {
    assert.equal(project.id, project.slug);
    assert.ok(project.name.trim());
    assert.ok(project.summary.trim());
    assert.ok(project.primaryCapability.trim());
    assert.ok(project.characteristics.length > 0);
    assert.ok(project.sourceUrl.startsWith("https://"));
    if (project.preview) {
      assert.ok(["motion-controlled", "static"].includes(project.preview.kind));
      assert.ok(["product-recreation", "synthetic-demo"].includes(project.preview.fixture));
    }
  }
});

test("project validation rejects duplicate ids, slugs, and preview ids", () => {
  assert.throws(() => validateProjectRecords([...projects, projects[0]]), /Duplicate project id/);
  const first = projects[0];
  assert.throws(
    () => validateProjectRecords([{ ...first, id: "hexframe", slug: "hexframe" }, ...projects.slice(1)]),
    /Duplicate project id|Duplicate project slug/
  );
  assert.throws(
    () => validateProjectRecords([first, { ...projects[1], preview: { id: first.preview.id, kind: "motion-controlled", fixture: "product-recreation" } }, projects[2]]),
    /Duplicate project preview id/
  );
});

test("metadata and routes derive from typed project facts", () => {
  assert.equal(projectRoutes.length, projects.reduce((count, project) => count + 1 + (project.caseStudy ? 1 : 0), 0));
  assert.equal(new Set(projectRoutes).size, projectRoutes.length);

  for (const project of projects) {
    const overview = projectOverviewMetadata(project);
    assert.equal(overview.path, projectPath(project.slug));
    assert.equal(overview.title, project.name + " — WizardGang Project");
    assert.ok(overview.description.startsWith(project.narrative.tagline));

    const caseStudy = projectCaseStudyMetadata(project);
    if (project.caseStudy) {
      assert.ok(caseStudy);
      assert.equal(caseStudy.path, projectCaseStudyPath(project.slug));
      assert.equal(caseStudy.description, project.summary);
      assert.match(caseStudy.title, /Case Study \| WizardGang$/);
    } else {
      assert.equal(caseStudy, null);
    }
  }
});

test("project actions use one predictable hierarchy and adapt to optional destinations", () => {
  for (const project of projects) {
    const card = projectActionsFor(project, "card");
    assert.equal(card[0].id, "project");
    assert.equal(card[0].primary, true);
    assert.equal(card[0].href, projectPath(project.slug));

    const overview = projectActionsFor(project, "overview");
    assert.equal(overview.filter((action) => action.primary).length, 1);
    assert.equal(overview.at(-1).id, "source");
    assert.equal(overview.at(-1).href, project.sourceUrl);
    assert.equal(overview.some((action) => action.id === "live"), Boolean(project.liveUrl));
    assert.equal(overview.some((action) => action.id === "case-study"), Boolean(project.caseStudy));
    assert.equal(overview.some((action) => action.id === "evidence"), Boolean(project.operationsUrl));

    const caseStudy = projectActionsFor(project, "case-study");
    assert.equal(caseStudy[0].id, "project");
    assert.equal(caseStudy[0].primary, true);
    assert.equal(caseStudy.some((action) => action.id === "live"), Boolean(project.liveUrl));
    assert.equal(caseStudy.some((action) => action.id === "evidence"), Boolean(project.operationsUrl));
  }
});

test("typed project routes cover the exact canonical project outputs", () => {
  const expected = ["software/projects/index.html", ...projectRoutes];
  assert.equal(new Set(expected).size, expected.length);
  for (const relative of expected) assert.equal(CANONICAL_PAGES.has(relative), true, "unexpected project route " + relative);
});

test("React source owns one shared project presentation contract", async () => {
  const surfaces = await readFile(resolve(root, "src/components/ProjectSurfaces.tsx"), "utf8");
  const previews = await readFile(resolve(root, "src/components/ProjectPreviews.tsx"), "utf8");
  const pages = await readFile(resolve(root, "src/pages/Projects.tsx"), "utf8");

  for (const signal of ["ProjectCard", "ProjectActions", "ProjectDetails", "ProjectOverviewHeader", "ProjectCaseStudyHeader", "ProjectArchitecture", "ProjectVisualFrame"]) {
    assert.ok(surfaces.includes(signal), "shared surface missing " + signal);
  }
  for (const signal of ["SharkTankPreview", "HexframePreview", "YarReaderPreview", "tank-rocket-burst", "hexframe-move-data", "data-fixture=\"synthetic\""]) assert.ok(previews.includes(signal));
  for (const signal of ["ProjectsIndexPage", "ProjectOverviewPage", "SharkTankCaseStudy", "StandardProjectCaseStudy", "createProjectPageDefinitions"]) assert.ok(pages.includes(signal));
  for (const path of ["src/site.mjs", "src/projects.mjs"]) await assert.rejects(access(resolve(root, path)), { code: "ENOENT" });
});

test("catalog cards use one semantic hierarchy and every active project appears once", async () => {
  const html = await readDist("software/projects/index.html");
  const cards = tagBlocks(html, "article").filter(({ attrs }) => (attrs.get("class") || "").split(/\s+/).includes("project-card"));
  assert.equal(cards.length, projects.length);

  assert.equal(tagBlocks(html, "h2").filter(({ inner }) => projects.some((project) => textContent(inner) === project.name)).length, projects.length, "catalog project headings must follow the page H1 at H2");
  for (const project of projects) {
    const projectAnchors = anchors(html).filter((anchor) => anchor.href === projectPath(project.slug));
    assert.equal(projectAnchors.length, 2, project.slug + " must expose one heading link and one View project action");
    assert.ok(textContent(html).includes(project.primaryCapability));
    assert.ok(projectAnchors.some((anchor) => /View project/i.test(textContent(anchor.inner))));
  }
});

test("Home keeps project cards subordinate to its project-section heading", async () => {
  const home = await readDist("index.html");
  for (const project of projects) {
    assert.ok(tagBlocks(home, "h3").some(({ inner }) => textContent(inner) === project.name), "Home card heading drifted for " + project.slug);
  }
});

test("project catalog, overviews, and case studies keep a logical H1-H3 heading sequence", async () => {
  const relatives = [
    "software/projects/index.html",
    ...projects.flatMap((project) => [
      "software/projects/" + project.slug + "/index.html",
      ...(project.caseStudy ? ["software/projects/" + project.slug + "/case-study/index.html"] : [])
    ])
  ];

  for (const relative of relatives) {
    const html = await readDist(relative);
    const main = tagBlocks(html, "main").find(({ attrs }) => attrs.get("id") === "main");
    assert.ok(main, relative + " missing main landmark");
    const ranks = [...main.inner.matchAll(/<h([1-3])\b/gi)].map((match) => Number(match[1]));
    assert.equal(ranks[0], 1, relative + " must begin its heading outline with H1");
    assert.equal(ranks.filter((rank) => rank === 1).length, 1, relative + " must contain exactly one H1");
    for (let index = 1; index < ranks.length; index += 1) {
      assert.ok(ranks[index] <= ranks[index - 1] + 1, relative + " skips a heading level");
    }
  }
});

test("generated overviews and case studies preserve project identity, canonical metadata, actions, and preview semantics", async () => {
  for (const project of projects) {
    const overview = await readDist("software/projects/" + project.slug + "/index.html");
    assert.equal(tagBlocks(overview, "h1").length, 1);
    assert.equal(linkByRel(overview, "canonical")?.attrs.get("href"), ORIGIN + projectPath(project.slug));
    assert.ok(anchors(overview).some((anchor) => anchor.href === project.sourceUrl));
    if (project.liveUrl) assert.ok(anchors(overview).some((anchor) => anchor.href === project.liveUrl));
    if (project.caseStudy) assert.ok(anchors(overview).some((anchor) => anchor.href === projectCaseStudyPath(project.slug)));
    const overviewPreview = startTags(overview, "div").find(({ attrs }) => attrs.get("data-preview-id") === project.preview?.id);
    if (project.preview) {
      assert.ok(overviewPreview);
      assert.equal(overviewPreview.attrs.get("aria-hidden"), "true");
      assert.ok(overviewPreview.attrs.has("inert"));
      assert.equal(overviewPreview.attrs.get("data-preview-kind"), project.preview.kind);
      assert.equal(overviewPreview.attrs.get("data-preview-fixture"), project.preview.fixture);
    }

    if (!project.caseStudy) continue;
    const caseStudy = await readDist("software/projects/" + project.slug + "/case-study/index.html");
    assert.equal(tagBlocks(caseStudy, "h1").length, 1);
    assert.equal(linkByRel(caseStudy, "canonical")?.attrs.get("href"), ORIGIN + projectCaseStudyPath(project.slug));
    assert.ok(anchors(caseStudy).some((anchor) => anchor.href === projectPath(project.slug)));
    assert.ok(anchors(caseStudy).some((anchor) => anchor.href === project.sourceUrl));
    if (project.liveUrl) assert.ok(anchors(caseStudy).some((anchor) => anchor.href === project.liveUrl));
    if (project.operationsUrl) assert.ok(anchors(caseStudy).some((anchor) => anchor.href === project.operationsUrl));
  }

  const yar = await readDist("software/projects/yarreader/index.html");
  assert.match(yar, /Original demo artwork/);
  assert.ok(startTags(yar, "div").some(({ attrs }) => attrs.get("data-fixture") === "synthetic"));

  const hex = await readDist("software/projects/hexframe/index.html");
  assert.match(textContent(hex), /standing_light/);
  assert.match(textContent(hex), /30 damage · 3 pushback · 2 frames active/);

  const shark = await readDist("software/projects/sharktank/index.html");
  for (const marker of ["tank-food-eat", "tank-dash-trail", "tank-rocket-shot", "tank-rocket-burst", "tank-abilities"]) assert.ok(shark.includes(marker));
});

test("source, live, and evidence URLs stay aligned with the existing relationship contract", () => {
  for (const project of projects) {
    const relationships = PROJECT_LINKS[project.slug];
    assert.equal(project.sourceUrl, relationships.source);
    assert.equal(project.liveUrl, relationships.live);
    if (relationships.evidence) assert.equal(project.operationsUrl, relationships.evidence);
    else assert.equal(project.operationsUrl, undefined);
  }
});

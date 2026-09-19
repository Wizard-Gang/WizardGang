import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { projects, PROJECTS_INDEX_METADATA, projectRoutes } from "../src/data/projects.ts";
import { CANONICAL_PAGES, PROJECT_LINKS, anchors, readDist, startTags, tagBlocks, textContent } from "./helpers.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

test("typed project data has unique slugs, metadata, routes, and source relationships", () => {
  assert.equal(projects.length, 3);
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  assert.deepEqual(projects.map((project) => project.slug), ["sharktank", "hexframe", "yarreader"]);
  assert.equal(PROJECTS_INDEX_METADATA.path, "/projects/");
  assert.equal(projectRoutes.length, 6);
  assert.equal(new Set(projectRoutes).size, projectRoutes.length);

  for (const project of projects) {
    assert.equal(project.overviewMetadata.path, `/projects/${project.slug}/`);
    assert.equal(project.caseStudyMetadata.path, `/projects/${project.slug}/case-study/`);
    assert.ok(project.overviewMetadata.title.length > 10);
    assert.ok(project.overviewMetadata.description.length > 40);
    assert.ok(project.caseStudyMetadata.title.length > 10);
    assert.ok(project.caseStudyMetadata.description.length > 40);
    assert.equal(project.sourceUrl, PROJECT_LINKS[project.slug].source);
    assert.equal(project.liveUrl, PROJECT_LINKS[project.slug].live);
    if (PROJECT_LINKS[project.slug].evidence) assert.equal(project.operationsUrl, PROJECT_LINKS[project.slug].evidence);
  }
});

test("typed project routes cover the exact canonical project outputs", () => {
  const expected = ["projects/index.html", ...projectRoutes];
  assert.equal(new Set(expected).size, expected.length);
  for (const relative of expected) assert.equal(CANONICAL_PAGES.has(relative), true, `unexpected project route ${relative}`);
});

test("retired project presentation sources remain absent", async () => {
  const home = await readFile(resolve(root, "src/pages/Home.tsx"), "utf8");
  assert.match(home, /ProjectCardGrid/);
  for (const path of ["src/site.mjs", "src/projects.mjs"]) {
    await assert.rejects(access(resolve(root, path)), { code: "ENOENT" });
  }
});

test("React source owns project cards, actions, previews, and project pages", async () => {
  const surfaces = await readFile(resolve(root, "src/components/ProjectSurfaces.tsx"), "utf8");
  const previews = await readFile(resolve(root, "src/components/ProjectPreviews.tsx"), "utf8");
  const pages = await readFile(resolve(root, "src/pages/Projects.tsx"), "utf8");

  for (const signal of ["ProjectCard", "ProjectActions", "ProjectTags", "ProjectPreview"]) assert.ok(surfaces.includes(signal));
  for (const signal of ["SharkTankPreview", "HexframePreview", "YarReaderPreview", "tank-rocket-burst", "hexframe-move-data", "data-fixture=\"synthetic\""]) assert.ok(previews.includes(signal));
  for (const signal of ["ProjectsIndexPage", "ProjectOverviewPage", "SharkTankCaseStudy", "StandardProjectCaseStudy", "createProjectPageDefinitions"]) assert.ok(pages.includes(signal));
});

test("every generated project overview and case study retains navigation and React preview semantics", async () => {
  const index = await readDist("projects/index.html");
  const inertPreviews = startTags(index, "div").filter(({ attrs }) => attrs.get("aria-hidden") === "true" && attrs.has("inert"));
  assert.equal(inertPreviews.length, 3);

  for (const project of projects) {
    const overview = await readDist(`projects/${project.slug}/index.html`);
    const caseStudy = await readDist(`projects/${project.slug}/case-study/index.html`);
    assert.equal(tagBlocks(overview, "h1").length, 1);
    assert.equal(tagBlocks(caseStudy, "h1").length, 1);
    assert.ok(anchors(overview).some((anchor) => anchor.href === `/projects/${project.slug}/case-study/`));
    assert.ok(anchors(caseStudy).some((anchor) => anchor.href === `/projects/${project.slug}/`));
    assert.ok(anchors(overview).some((anchor) => anchor.href === project.sourceUrl));
    assert.ok(anchors(caseStudy).some((anchor) => anchor.href === project.sourceUrl));
    const overviewPreview = startTags(overview, "div").find(({ attrs }) => attrs.get("aria-hidden") === "true" && attrs.has("inert"));
    const casePreview = startTags(caseStudy, "div").find(({ attrs }) => attrs.get("aria-hidden") === "true" && attrs.has("inert"));
    assert.ok(overviewPreview);
    assert.ok(casePreview);
  }

  const yar = await readDist("projects/yarreader/index.html");
  assert.match(yar, /Original demo artwork/);
  assert.ok(startTags(yar, "div").some(({ attrs }) => attrs.get("data-fixture") === "synthetic"));

  const hex = await readDist("projects/hexframe/index.html");
  assert.match(textContent(hex), /standing_light/);
  assert.match(textContent(hex), /30 damage · 3 pushback · 2 frames active/);

  const shark = await readDist("projects/sharktank/index.html");
  for (const marker of ["tank-food-eat", "tank-dash-trail", "tank-rocket-shot", "tank-rocket-burst", "tank-abilities"]) assert.ok(shark.includes(marker));
});

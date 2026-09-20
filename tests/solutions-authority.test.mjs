import assert from "node:assert/strict";
import test from "node:test";
import {
  DEMO_FRAMEWORK_AREAS,
  DEMO_FRAMEWORK_PATH,
  DEMO_FRAMEWORK_PROCESS,
  DEMO_FRAMEWORK_URL,
  SOLUTIONS_ROOT_PATH,
  WEBSITES_SOLUTION_PATH,
  WEBSITE_PACKAGES,
  demoFrameworkSolution,
  solutionPath,
  solutions,
  validateSolutions,
  websitesSolution
} from "../src/data/solutions.ts";
import { CANONICAL_PAGES, SITEMAP_ROUTES, anchors, linkByRel, metaContent, readDist, readRoot, tagBlocks, textContent } from "./helpers.mjs";

const ORIGIN = "https://wizardgang.ai";

test("typed Solutions authority is small, unique, and canonical", () => {
  assert.deepEqual(solutions.map((solution) => solution.id), ["websites", "demo-framework"]);
  assert.equal(new Set(solutions.map((solution) => solution.id)).size, solutions.length);
  assert.equal(new Set(solutions.map((solution) => solution.slug)).size, solutions.length);
  assert.equal(new Set(solutions.map((solution) => solution.path)).size, solutions.length);
  assert.equal(websitesSolution.path, WEBSITES_SOLUTION_PATH);
  assert.equal(demoFrameworkSolution.path, DEMO_FRAMEWORK_PATH);
  assert.equal(demoFrameworkSolution.externalUrl, DEMO_FRAMEWORK_URL);
  assert.equal(solutionPath("websites"), WEBSITES_SOLUTION_PATH);
  assert.equal(solutionPath("demo-framework"), DEMO_FRAMEWORK_PATH);
  assert.doesNotThrow(() => validateSolutions());
  assert.equal(WEBSITE_PACKAGES.length, 3);
});

test("Demo Framework process model is ordered, complete, and unique", () => {
  assert.deepEqual(
    DEMO_FRAMEWORK_PROCESS.map((step) => step.id),
    ["requirement", "change", "validation", "release", "deployment", "operation"]
  );
  assert.equal(new Set(DEMO_FRAMEWORK_PROCESS.map((step) => step.id)).size, DEMO_FRAMEWORK_PROCESS.length);
  for (const step of DEMO_FRAMEWORK_PROCESS) {
    assert.ok(step.name.trim());
    assert.ok(step.description.trim());
  }
  assert.equal(new Set(DEMO_FRAMEWORK_AREAS.map((area) => area.id)).size, DEMO_FRAMEWORK_AREAS.length);
});

test("Solutions route family is canonical and Services is compatibility-only", async () => {
  for (const [relative, route] of [
    ["solutions/index.html", SOLUTIONS_ROOT_PATH],
    ["solutions/websites/index.html", WEBSITES_SOLUTION_PATH],
    ["solutions/demo-framework/index.html", DEMO_FRAMEWORK_PATH]
  ]) {
    assert.equal(CANONICAL_PAGES.get(relative), route);
    assert.ok(SITEMAP_ROUTES.includes(route), route + " missing from sitemap contract");
    const html = await readDist(relative);
    assert.equal(linkByRel(html, "canonical")?.attrs.get("href"), ORIGIN + route);
    assert.equal(metaContent(html, "property", "og:url"), ORIGIN + route);
    assert.equal(tagBlocks(html, "h1").length, 1);
  }

  assert.equal(CANONICAL_PAGES.has("services/index.html"), false);
  assert.equal(SITEMAP_ROUTES.includes("/services/"), false);
  const sitemap = await readDist("sitemap.xml");
  assert.doesNotMatch(sitemap, /wizardgang\.ai\/services\//);
  assert.match(sitemap, /wizardgang\.ai\/solutions\/websites\//);
  assert.match(sitemap, /wizardgang\.ai\/solutions\/demo-framework\//);
});

test("Solutions landing orients to canonical children without duplicating Software catalogs", async () => {
  const html = await readDist("solutions/index.html");
  const plain = textContent(html);
  assert.match(plain, /Software is what WizardGang builds/);
  assert.match(plain, /Solutions are repeatable delivery approaches/i);
  assert.ok(anchors(html).some((anchor) => anchor.href === WEBSITES_SOLUTION_PATH));
  assert.ok(anchors(html).some((anchor) => anchor.href === DEMO_FRAMEWORK_PATH));
  assert.doesNotMatch(plain, /SharkTank|Hexframe|YarReader|APIs & Services|Enterprise Systems|Identity & Access/);
});

test("Demo Framework keeps one external depth boundary and semantic process order", async () => {
  const html = await readDist("solutions/demo-framework/index.html");
  const external = anchors(html).filter((anchor) => anchor.href === DEMO_FRAMEWORK_URL);
  assert.ok(external.length >= 2);
  for (const anchor of external) {
    assert.ok((anchor.attrs.get("aria-label") || textContent(anchor.inner)).toLowerCase().includes("demo"));
    assert.equal(anchor.attrs.get("target"), undefined, "external demo links follow the no-forced-new-tab policy");
  }

  const process = tagBlocks(html, "ol").find(({ attrs }) => (attrs.get("class") || "").includes("solution-process-list"));
  assert.ok(process, "Demo Framework process must be an ordered list");
  assert.equal(tagBlocks(process.inner, "li").length, DEMO_FRAMEWORK_PROCESS.length);
  for (const step of DEMO_FRAMEWORK_PROCESS) {
    assert.ok(process.inner.includes("data-process-step=\"" + step.id + "\""));
    assert.ok(textContent(process.inner).includes(step.name));
  }

  const plain = textContent(html);
  assert.match(plain, /Requirement → Change → Validation → Release → Deployment → Operation/);
  assert.match(plain, /not certification claims/i);
  assert.doesNotMatch(plain, /ISO certified|ISO compliant|certified AI management system/i);
  assert.doesNotMatch(html, /href="\/solutions\/demo-framework\/(?:security|operations|assurance|interfaces)\//);
});

test("Websites owns former Services content without inventing packages", async () => {
  const html = await readDist("solutions/websites/index.html");
  const plain = textContent(html);
  for (const item of WEBSITE_PACKAGES) {
    assert.ok(plain.includes(item.name));
    assert.ok(plain.includes(item.price));
  }
  assert.match(plain, /Your website\. Your code\. Your infrastructure\./);
  assert.match(plain, /Built to be handed over/);
  assert.doesNotMatch(plain, /Demo Framework|Requirement → Change/);
});

test("Home and Company orient through canonical main-site solution routes", async () => {
  const home = await readDist("index.html");
  const company = await readDist("about/company/index.html");
  assert.ok(anchors(home).some((anchor) => anchor.href === WEBSITES_SOLUTION_PATH));
  assert.ok(anchors(home).some((anchor) => anchor.href === DEMO_FRAMEWORK_PATH));
  assert.equal(anchors(home).some((anchor) => anchor.href === DEMO_FRAMEWORK_URL), false);
  assert.ok(anchors(company).some((anchor) => anchor.href === DEMO_FRAMEWORK_PATH));
});

test("source authority does not retain a competing canonical Services page", async () => {
  const registry = await readRoot("src/app/pageRegistry.ts");
  const home = await readRoot("src/pages/Home.tsx");
  const company = await readRoot("src/pages/About.tsx");
  assert.doesNotMatch(registry, /SERVICES_PAGE|pages\/Services/);
  assert.doesNotMatch(home, /href="\/services\//);
  assert.doesNotMatch(company, /https:\/\/demo\.wizardgang\.ai/);
  assert.match(registry, /WEBSITES_SOLUTION_PAGE/);
  assert.match(registry, /DEMO_FRAMEWORK_PAGE/);
});

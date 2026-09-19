import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { CANONICAL_PAGES, readDist, tagBlocks, textContent } from "./helpers.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const readRoot = (path) => readFile(resolve(root, path), "utf8");

test("typed React registry owns every canonical static page", async () => {
  const registry = await readRoot("src/app/pageRegistry.ts");
  for (const authority of [
    "HOME_PAGE",
    "SERVICES_PAGE",
    "ABOUT_PAGE",
    "SOFTWARE_PAGE",
    "SOLUTIONS_PAGE",
    "GLOSSARY_PAGE",
    "NOT_FOUND_PAGE",
    "createProjectPageDefinitions",
    "createWorkPageDefinitions"
  ]) assert.ok(registry.includes(authority), `missing page authority ${authority}`);

  const vite = await readRoot("vite.config.ts");
  assert.match(vite, /renderStaticDocuments/);
  assert.doesNotMatch(vite, /siteModule|createPageDefinitions|renderDocument\(|legacyPages/);

  for (const path of ["src/site.mjs", "src/projects.mjs", "src/professional.mjs", "src/professional-systems.mjs", "public/assets/site.js"]) {
    await assert.rejects(access(resolve(root, path)), { code: "ENOENT" });
  }

  assert.equal(CANONICAL_PAGES.size, 15);
  for (const relative of CANONICAL_PAGES.keys()) {
    const html = await readDist(relative);
    assert.equal(tagBlocks(html, "main").length, 1, `${relative} must have one React-authored main`);
    assert.equal(tagBlocks(html, "h1").length, 1, `${relative} must have one H1`);
  }
});

test("remaining current-state pages retain substantive content after React migration", async () => {
  const pages = [
    ["index.html", ["Jacob Yongue", "I build systems that ship.", "Selected projects", "Selected work", "Capabilities", "About"]],
    ["about/index.html", ["About Jacob Yongue", "Systems thinking", "Implementation depth", "Project ownership", "Learning velocity"]],
    ["software/index.html", ["Software, systems,", "Current software projects.", "Integration experience.", "View current projects"]],
    ["solutions/index.html", ["Reusable approaches", "Owner-controlled websites.", "Architecture you can inspect.", "Open architecture demo"]],
    ["services/index.html", ["Launch the site.", "Keep the keys.", "Starter", "$95", "Business", "$195", "Owner+", "$350"]],
    ["glossary/index.html", ["Technical terms.", "Artificial intelligence (AI)", "Application programming interface (API)", "Web Content Accessibility Guidelines (WCAG)"]],
    ["404.html", ["404 / Route not found", "Nothing here.", "View projects", "Home"]]
  ];

  for (const [relative, phrases] of pages) {
    const plain = textContent(await readDist(relative));
    for (const phrase of phrases) assert.ok(plain.includes(phrase), `${relative} missing ${phrase}`);
  }
});

test("Home reuses typed project and professional authorities instead of duplicating facts", async () => {
  const home = await readRoot("src/pages/Home.tsx");
  assert.match(home, /SelectedProjectsSection/);
  assert.match(home, /SelectedWorkGrid/);
  assert.doesNotMatch(home, /University of Georgia|Supply Chain Technologies|SharkTank|Hexframe|YarReader/);
});

test("structured service and glossary records are typed outside legacy rendering", async () => {
  const services = await readRoot("src/data/services.ts");
  const glossary = await readRoot("src/data/glossary.ts");
  assert.match(services, /ServicePackage/);
  assert.match(services, /WEBSITE_PACKAGES/);
  assert.match(glossary, /GlossaryEntry/);
  assert.match(glossary, /GLOSSARY/);
});

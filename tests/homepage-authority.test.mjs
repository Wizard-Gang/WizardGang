import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../src/data/projects.ts";
import { DEMO_FRAMEWORK_PATH, WEBSITES_SOLUTION_PATH, demoFrameworkSolution, websitesSolution } from "../src/data/solutions.ts";
import { anchors, linkByRel, metaContent, readDist, tagBlocks, textContent } from "./helpers.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const readSource = (path) => readFile(resolve(root, path), "utf8");

test("homepage source is company-first and consumes existing typed authorities", async () => {
  const source = await readSource("src/pages/Home.tsx");

  assert.match(source, /ProjectCardGrid projects=\{projects\}/);
  assert.match(source, /INTEGRATIONS_PATH/);
  assert.match(source, /WEBSITES_SOLUTION_PATH/);
  assert.match(source, /DEMO_FRAMEWORK_PATH/);
  assert.match(source, /websitesSolution/);
  assert.match(source, /demoFrameworkSolution/);
  assert.doesNotMatch(source, /professional-systems|systemGroups|integrationGroups|CapabilityList/);
  assert.doesNotMatch(source, /SelectedWorkGrid|HOME_CAPABILITIES/);
  assert.doesNotMatch(source, /SharkTank|Hexframe|YarReader|University of Georgia|Supply Chain Technologies/);
  assert.doesNotMatch(source, /I build systems that ship|Software engineer · Systems · Project delivery|Selected work/);

  assert.equal(projects.length, 3, "homepage project examples must continue to come from the canonical project authority");
});

test("generated homepage presents WizardGang as the subject with one clear hierarchy", async () => {
  const html = await readDist("index.html");
  const headings = tagBlocks(html, "h1");
  assert.equal(headings.length, 1);
  assert.equal(textContent(headings[0].inner), "Build software. Make it inspectable.");

  const plain = textContent(html);
  assert.match(plain, /WizardGang builds and publishes practical software/);
  assert.match(plain, /employer and customer evidence remains attributed/i);
  assert.match(plain, /Reusable approaches, separate from products/);
  assert.match(plain, /WizardGang is built by Jacob Yongue/);
  assert.doesNotMatch(plain, /I build systems that ship|Software engineer · Systems · Project delivery|Selected work/);

  for (const project of projects) assert.ok(plain.includes(project.name), `homepage missing project ${project.name}`);

  const hrefs = new Set(anchors(html).map((anchor) => anchor.href));
  assert.ok(plain.includes(websitesSolution.summary));
  assert.ok(plain.includes(demoFrameworkSolution.summary));

  for (const href of ["/software/", "/software/integrations/", "/software/projects/", "/about/team/jacob/", "/solutions/", WEBSITES_SOLUTION_PATH, DEMO_FRAMEWORK_PATH, "/about/", "/about/company/", "/about/team/", "mailto:jacob@wizardgang.ai"]) {
    assert.ok(hrefs.has(href), `homepage missing ${href}`);
  }
  assert.equal(hrefs.has("/services/"), false, "homepage must not link to the retired Services canonical");
  assert.equal(hrefs.has("https://demo.wizardgang.ai"), false, "homepage should orient through the canonical Demo Framework page");
});

test("homepage metadata is company-first and retains the root canonical", async () => {
  const html = await readDist("index.html");
  const title = textContent(tagBlocks(html, "title")[0].inner);
  const description = metaContent(html, "name", "description") || "";

  assert.equal(title, "WizardGang — Software, Systems & Integrations");
  assert.match(description, /^WizardGang\b/);
  assert.doesNotMatch(description, /Jacob Yongue|portfolio/i);
  assert.equal(linkByRel(html, "canonical")?.attrs.get("href"), "https://wizardgang.ai/");
  assert.equal(metaContent(html, "property", "og:title"), title);
  assert.equal(metaContent(html, "property", "og:description"), description);
  assert.equal(metaContent(html, "property", "og:image"), "https://wizardgang.ai/og.jpg");
  assert.match(metaContent(html, "property", "og:image:alt") || "", /WizardGang/i);
});

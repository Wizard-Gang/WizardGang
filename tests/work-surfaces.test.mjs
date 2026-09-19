import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { professionalProjects, professionalRoles, professionalSkills } from "../src/data/professional.ts";
import { deployments, integrationGroups, systemGroups } from "../src/data/professional-systems.ts";
import { anchors, linkByRel, readDist, startTags, tagBlocks, textContent } from "./helpers.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

test("typed professional authorities preserve current roles, project history, skills, systems, integrations, and deployments", () => {
  assert.deepEqual(
    professionalRoles.map((role) => role.organization),
    ["University of Georgia", "Supply Chain Technologies", "Spartan Technology Solutions", "Shadow Money Wizard Gang", "FastFetch Corp"]
  );
  assert.equal(professionalRoles[0].dates, "May 2026 - Current");
  assert.equal(professionalRoles[1].dates, "Sep 2024 - Apr 2026");
  assert.equal(professionalProjects.length, 15);
  assert.equal(professionalSkills.length, 4);
  assert.equal(systemGroups.length, 5);
  assert.equal(integrationGroups.length, 8);
  assert.equal(deployments.length, 22);

  const integrationByName = new Map(integrationGroups.flatMap((group) => group.items.map((item) => [item.name, item])));
  assert.equal(integrationByName.get("Axon")?.url, "https://www.axon.com/");
  assert.equal(integrationByName.get("LexisNexis")?.url, "https://www.lexisnexis.com/en-us/");
  assert.equal(integrationByName.get("CIMS WMS")?.url, "https://cloudimsystems.com/");
  assert.equal(integrationByName.get("Canbar")?.url, null);
});

test("legacy professional data and Work rendering authority are removed", async () => {
  const site = await readFile(resolve(root, "src/site.mjs"), "utf8");
  for (const retired of [
    "professional.mjs",
    "professional-systems.mjs",
    "professionalRoles",
    "professionalSkills",
    "integrationGroups",
    "systemGroups",
    "deployments",
    "function work()",
    "function officialReference",
    "function referenceGroups",
    "function capabilityList"
  ]) {
    assert.ok(!site.includes(retired), `legacy professional authority remains: ${retired}`);
  }

  assert.match(site, /ownsProductionPages:\s*false/);
  const home = await readFile(resolve(root, "src/pages/Home.tsx"), "utf8");
  assert.match(home, /SelectedWorkGrid/);
  await assert.rejects(access(resolve(root, "src/professional.mjs")), { code: "ENOENT" });
  await assert.rejects(access(resolve(root, "src/professional-systems.mjs")), { code: "ENOENT" });
});

test("React owns the canonical Work route and shared Home professional-role projection", async () => {
  const pageSource = await readFile(resolve(root, "src/pages/Work.tsx"), "utf8");
  const componentSource = await readFile(resolve(root, "src/components/ProfessionalSurfaces.tsx"), "utf8");
  const homeSource = await readFile(resolve(root, "src/pages/Home.tsx"), "utf8");
  const registrySource = await readFile(resolve(root, "src/app/pageRegistry.ts"), "utf8");

  assert.match(pageSource, /createWorkPageDefinitions/);
  assert.match(pageSource, /relative: "work\/index\.html"/);
  assert.match(pageSource, /ProfessionalRoleGrid/);
  assert.match(pageSource, /SystemGroups/);
  assert.match(pageSource, /IntegrationGroups/);
  assert.match(pageSource, /ReferenceList/);
  assert.match(componentSource, /ExternalOrganizationLink/);
  assert.match(homeSource, /SelectedWorkGrid/);
  assert.match(registrySource, /createWorkPageDefinitions/);
});

test("generated Work output preserves metadata, professional ordering, semantics, references, and skills", async () => {
  const html = await readDist("work/index.html");
  const plain = textContent(html);
  const h1s = tagBlocks(html, "h1");
  assert.equal(h1s.length, 1);
  assert.match(textContent(h1s[0].inner), /Production work\. Operational stakes\./);

  const title = tagBlocks(html, "title")[0];
  assert.ok(title);
  assert.equal(textContent(title.inner), "Work — Jacob Yongue | Professional Portfolio");
  assert.equal(linkByRel(html, "canonical")?.attrs.get("href"), "https://wizardgang.ai/work/");

  let cursor = -1;
  for (const role of professionalRoles) {
    const index = plain.indexOf(role.organization, cursor + 1);
    assert.ok(index > cursor, `role order changed for ${role.organization}`);
    cursor = index;
    for (const value of [role.dates, role.role, role.summary]) assert.ok(plain.includes(value), `missing role value ${value}`);
  }

  for (const group of systemGroups) {
    assert.ok(plain.includes(group.title));
    for (const item of group.items) assert.ok(plain.includes(item), `missing system item ${item}`);
  }

  const hrefs = new Set(anchors(html).map((anchor) => anchor.href));
  for (const group of integrationGroups) {
    assert.ok(plain.includes(group.title));
    for (const item of group.items) {
      assert.ok(plain.includes(item.name), `missing integration ${item.name}`);
      if (item.url) assert.ok(hrefs.has(item.url), `missing integration URL ${item.url}`);
    }
  }
  for (const deployment of deployments) {
    assert.ok(plain.includes(deployment.name), `missing deployment ${deployment.name}`);
    assert.ok(hrefs.has(deployment.url), `missing deployment URL ${deployment.url}`);
  }

  for (const group of professionalSkills) {
    assert.ok(plain.includes(group.label));
    for (const item of group.items) assert.ok(plain.includes(item), `missing skill ${item}`);
  }
  assert.ok(startTags(html, "ul").some(({ attrs }) => attrs.get("aria-label") === "Development &amp; data"));
});

test("Home React composition projects the same typed professional roles", async () => {
  const html = await readDist("index.html");
  assert.doesNotMatch(html, /data-wizardgang-selected-work/);
  const selected = tagBlocks(html, "section").find(({ attrs }) => (attrs.get("class") || "").split(/\s+/).includes("selected-work"));
  assert.ok(selected);
  const plain = textContent(selected.inner);
  let cursor = -1;
  for (const role of professionalRoles) {
    const index = plain.indexOf(role.organization, cursor + 1);
    assert.ok(index > cursor, `Home role order changed for ${role.organization}`);
    cursor = index;
  }
});

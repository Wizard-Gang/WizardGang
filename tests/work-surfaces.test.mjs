import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { professionalProjects, professionalRoles, professionalSkills } from "../src/data/professional.ts";
import { deployments, professionalIntegrationEvidence, professionalSystemEvidence } from "../src/data/professional-systems.ts";
import { anchors, linkByRel, readDist, startTags, tagBlocks, textContent } from "./helpers.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

test("typed professional authorities preserve current roles, project history, skills, attributed system/integration evidence, and deployments", () => {
  assert.deepEqual(
    professionalRoles.map((role) => role.organization),
    ["University of Georgia", "Supply Chain Technologies", "Spartan Technology Solutions", "Shadow Money Wizard Gang", "FastFetch Corp"]
  );
  assert.equal(professionalRoles[0].dates, "May 2026 - Current");
  assert.equal(professionalRoles[1].dates, "Sep 2024 - Apr 2026");
  assert.equal(professionalProjects.length, 15);
  assert.equal(professionalSkills.length, 4);
  assert.equal(professionalSystemEvidence.length, 5);
  assert.equal(professionalIntegrationEvidence.length, 8);
  assert.equal(deployments.length, 22);

  const integrationByName = new Map(professionalIntegrationEvidence.flatMap((group) => group.items.map((item) => [item.name, item])));
  assert.equal(integrationByName.get("Axon")?.url, "https://www.axon.com/");
  assert.equal(integrationByName.get("LexisNexis")?.url, "https://www.lexisnexis.com/en-us/");
  assert.equal(integrationByName.get("CIMS WMS")?.url, "https://cloudimsystems.com/");
  assert.equal(integrationByName.get("Canbar")?.url, null);
});

test("retired professional presentation sources remain absent, including the old Work page renderer", async () => {
  for (const path of ["src/site.mjs", "src/professional.mjs", "src/professional-systems.mjs", "src/pages/Work.tsx"]) {
    await assert.rejects(access(resolve(root, path)), { code: "ENOENT" });
  }
});

test("Jacob Team page consumes the existing professional TypeScript authorities", async () => {
  const pageSource = await readFile(resolve(root, "src/pages/About.tsx"), "utf8");
  const componentSource = await readFile(resolve(root, "src/components/ProfessionalSurfaces.tsx"), "utf8");
  const registrySource = await readFile(resolve(root, "src/app/pageRegistry.ts"), "utf8");

  for (const authority of ["professionalRoles", "professionalSkills", "deployments"]) {
    assert.ok(pageSource.includes(authority), `Jacob Team source missing typed authority ${authority}`);
  }
  for (const authority of ["professionalIntegrationEvidence", "professionalSystemEvidence"]) {
    assert.ok(!pageSource.includes(authority), `Jacob Team must not render the full professional evidence catalog: ${authority}`);
  }
  for (const component of ["ProfessionalRoleGrid", "ReferenceList", "SkillList"]) {
    assert.ok(pageSource.includes(component), `Jacob Team source missing presentation component ${component}`);
  }
  assert.doesNotMatch(componentSource, /IntegrationGroups|SystemGroups/);
  assert.match(componentSource, /ExternalOrganizationLink/);
  assert.doesNotMatch(registrySource, /createWorkPageDefinitions|pages\/Work/);
  assert.match(registrySource, /JACOB_TEAM_PAGE/);
});

test("generated Jacob Team page preserves professional ordering, evidence, semantics, and canonical metadata", async () => {
  const html = await readDist("about/team/jacob/index.html");
  const plain = textContent(html);
  const h1s = tagBlocks(html, "h1");
  assert.equal(h1s.length, 1);
  assert.equal(textContent(h1s[0].inner), "Build the whole path. Own the outcome.");

  const title = tagBlocks(html, "title")[0];
  assert.ok(title);
  assert.equal(textContent(title.inner), "Jacob Yongue — Professional Background | WizardGang Team");
  assert.equal(linkByRel(html, "canonical")?.attrs.get("href"), "https://wizardgang.ai/about/team/jacob/");
  const roleList = startTags(html, "div").find(({ attrs }) => (attrs.get("class") || "").split(/\s+/).includes("experience-grid"));
  assert.equal(roleList?.attrs.get("role"), "list");
  assert.equal(startTags(html, "article").filter(({ attrs }) => attrs.get("role") === "listitem").length, professionalRoles.length);

  for (const phrase of [
    "Professional background",
    "Production work. Operational stakes.",
    "Career history",
    "Professional integration evidence",
    "Experience stays attributed to the roles that produced it.",
    "Deployments",
    "Core skills",
    "prior employers and their customers is not presented as WizardGang client work"
  ]) assert.ok(plain.toLowerCase().includes(phrase.toLowerCase()), `Jacob page missing ${phrase}`);

  let cursor = -1;
  for (const role of professionalRoles) {
    const index = plain.indexOf(role.organization, cursor + 1);
    assert.ok(index > cursor, `role order changed for ${role.organization}`);
    cursor = index;
    for (const value of [role.dates, role.role, role.summary]) assert.ok(plain.includes(value), `missing role value ${value}`);
  }

  const hrefs = new Set(anchors(html).map((anchor) => anchor.href));
  for (const phrase of ["ERP and WMS integration work", "REST/JSON APIs", "SAML/SSO", "EDI", "ETL and data pipelines"]) {
    assert.ok(plain.includes(phrase), `missing attributed professional integration evidence ${phrase}`);
  }
  assert.ok(hrefs.has("/software/integrations/"), "Jacob page must link to the canonical WizardGang integration capability");
  for (const vendor of ["NetSuite", "Microsoft Dynamics", "Fishbowl", "Blue Yonder", "Axon", "LexisNexis"]) {
    assert.ok(!plain.includes(vendor), `Jacob page must not duplicate the full integration vendor catalog: ${vendor}`);
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

test("Work no longer generates canonical HTML and current first-party career links target Jacob directly", async () => {
  await assert.rejects(readDist("work/index.html"), { code: "ENOENT" });

  for (const relative of ["index.html", "software/index.html", "about/team/index.html", "about/team/jacob/index.html"]) {
    const html = await readDist(relative);
    assert.ok(!anchors(html).some((anchor) => anchor.href === "/work/"), `${relative} must not link to redirect-only /work/`);
  }

  const home = await readDist("index.html");
  assert.ok(anchors(home).some((anchor) => anchor.href === "/about/team/jacob/" && /supporting professional record/i.test(textContent(anchor.inner))));
});

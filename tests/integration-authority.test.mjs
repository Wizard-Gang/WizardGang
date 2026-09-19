import assert from "node:assert/strict";
import test from "node:test";
import { INTEGRATIONS_PATH, integrationCategories, validateIntegrationCategories } from "../src/data/integrations.ts";
import { CANONICAL_PAGES, anchors, internalTarget, linkByRel, readDist, readRoot, tagBlocks, textContent } from "./helpers.mjs";

function idsIn(html) {
  return new Set([...html.matchAll(/\sid=(?:"([^"]+)"|'([^']+)')/gi)].map((match) => match[1] ?? match[2]));
}

test("typed integration authority has stable unique identifiers and complete capability records", () => {
  assert.equal(INTEGRATIONS_PATH, "/software/integrations/");
  assert.deepEqual(integrationCategories.map((category) => category.id), [
    "apis-services",
    "enterprise-systems",
    "identity-access",
    "data-automation",
    "operational-interfaces"
  ]);
  assert.equal(new Set(integrationCategories.map((category) => category.id)).size, integrationCategories.length);

  const capabilityIds = [];
  const evidenceIds = [];
  for (const category of integrationCategories) {
    assert.ok(category.name.trim());
    assert.ok(category.summary.trim());
    assert.ok(category.capabilities.length > 0);
    assert.ok(category.evidence.length > 0);
    for (const capability of category.capabilities) {
      capabilityIds.push(capability.id);
      assert.ok(capability.name.trim());
      assert.ok(capability.description.trim());
      for (const values of [capability.systemTypes, capability.interfaces, capability.technologies]) {
        if (!values) continue;
        assert.equal(new Set(values.map((value) => value.toLowerCase())).size, values.length, `duplicate detail in ${capability.id}`);
      }
    }
    for (const evidence of category.evidence) {
      evidenceIds.push(evidence.id);
      assert.ok(evidence.label.trim());
      assert.ok(evidence.note.trim());
      assert.match(evidence.href, /^\//);
      assert.ok(["professional", "project"].includes(evidence.kind));
    }
  }
  assert.equal(new Set(capabilityIds).size, capabilityIds.length);
  assert.equal(new Set(evidenceIds).size, evidenceIds.length);
  assert.doesNotThrow(() => validateIntegrationCategories(integrationCategories));
});

test("integration validation rejects duplicate category and capability identifiers", () => {
  assert.throws(
    () => validateIntegrationCategories([...integrationCategories, integrationCategories[0]]),
    /Duplicate integration category id/
  );

  const category = integrationCategories[0];
  const capability = category.capabilities[0];
  assert.throws(
    () => validateIntegrationCategories([{ ...category, capabilities: [...category.capabilities, capability] }]),
    /Duplicate integration capability id/
  );
});

test("Integrations is the canonical company-facing capability surface", async () => {
  const html = await readDist("software/integrations/index.html");
  assert.equal(CANONICAL_PAGES.get("software/integrations/index.html"), INTEGRATIONS_PATH);
  assert.equal(tagBlocks(html, "h1").length, 1);
  assert.equal(linkByRel(html, "canonical")?.attrs.get("href"), "https://wizardgang.ai/software/integrations/");
  assert.equal(textContent(tagBlocks(html, "h1")[0].inner), "Connect systems. Keep ownership clear.");

  const ids = idsIn(html);
  for (const category of integrationCategories) {
    assert.ok(ids.has(category.id), `missing category fragment ${category.id}`);
    assert.ok(textContent(html).includes(category.name));
  }
});

test("integration evidence links resolve directly to canonical pages and fragments", async () => {
  for (const category of integrationCategories) {
    for (const evidence of category.evidence) {
      const target = internalTarget(evidence.href);
      assert.ok(target, `evidence must be internal: ${evidence.href}`);
      assert.equal(CANONICAL_PAGES.has(target.relative), true, `non-canonical evidence target ${evidence.href}`);
      if (!target.fragment) continue;
      const html = await readDist(target.relative);
      assert.ok(idsIn(html).has(target.fragment), `missing fragment ${evidence.href}`);
    }
  }
});

test("Home, Software, Team, and Services do not become competing integration catalogs", async () => {
  const [homeSource, softwareSource, aboutSource, servicesSource] = await Promise.all([
    readRoot("src/pages/Home.tsx"),
    readRoot("src/pages/CompanyNavigation.tsx"),
    readRoot("src/pages/About.tsx"),
    readRoot("src/pages/Services.tsx")
  ]);

  assert.match(homeSource, /INTEGRATIONS_PATH/);
  assert.doesNotMatch(homeSource, /professional-systems|integrationGroups|systemGroups/);
  assert.match(softwareSource, /integrationCategories/);
  assert.doesNotMatch(softwareSource, /professional-systems|integrationGroups|systemGroups/);
  assert.match(aboutSource, /import \{ deployments \} from "\.\.\/data\/professional-systems"/);
  assert.doesNotMatch(aboutSource, /IntegrationGroups|SystemGroups|integrationGroups|systemGroups/);
  assert.doesNotMatch(servicesSource, /integrationCategories|integrationGroups|systemGroups/);

  const home = textContent(await readDist("index.html"));
  const team = textContent(await readDist("about/team/jacob/index.html"));
  assert.match(home, /Integration capability with clear attribution/);
  assert.doesNotMatch(home, /NetSuite|Microsoft Dynamics|Fishbowl|RedPrairie|Blue Yonder/);
  assert.match(team, /ERP and WMS integration work/);
  assert.match(team, /REST\/JSON APIs/);
  assert.match(team, /SAML\/SSO/);
  assert.doesNotMatch(team, /NetSuite|Microsoft Dynamics|Fishbowl|RedPrairie|Blue Yonder/);
});

test("current production links use the canonical integrations path", async () => {
  for (const relative of ["index.html", "software/index.html", "about/team/jacob/index.html"]) {
    const html = await readDist(relative);
    assert.ok(anchors(html).some((anchor) => anchor.href === INTEGRATIONS_PATH), `${relative} missing canonical integrations link`);
  }
});

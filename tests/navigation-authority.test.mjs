import assert from "node:assert/strict";
import test from "node:test";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { NAVIGATION_ITEMS, navigationSectionForPath } from "../src/app/navigation.ts";
import { CANONICAL_PAGES, anchors, readDist, readRoot, tagBlocks, textContent } from "./helpers.mjs";

const expectedNavigation = [
  { key: "about", href: "/about/", label: "About" },
  { key: "software", href: "/software/", label: "Software" },
  { key: "solutions", href: "/solutions/", label: "Solutions" }
];

test("typed company navigation is exact and current-section matching is centralized", () => {
  assert.deepEqual(NAVIGATION_ITEMS, expectedNavigation);

  const cases = new Map([
    ["/", ""],
    ["/about/", "about"],
    ["/about/company/", "about"],
    ["/about/team/jacob/", "about"],
    ["/software/", "software"],
    ["/software/integrations/", "software"],
    ["/software/projects/sharktank/", "software"],
    ["/solutions/", "solutions"],
    ["/solutions/demo-framework/", "solutions"],
    ["/projects/", ""],
    ["/projects/sharktank/", ""],
    ["/work/", ""],
    ["/services/", ""],
    ["/glossary/", ""]
  ]);

  for (const [path, expected] of cases) {
    assert.equal(navigationSectionForPath(path), expected, `unexpected primary section for ${path}`);
  }
});

test("shared shell consumes company navigation without restoring portfolio-first items", async () => {
  const chrome = await readRoot("src/components/SiteChrome.tsx");
  const document = await readRoot("src/app/Document.tsx");
  const browserNavigation = await readRoot("src/browser/navigation.ts");

  assert.match(chrome, /import \{ NAVIGATION_ITEMS \} from "\.\.\/app\/navigation"/);
  assert.match(document, /navigationSectionForPath\(page\.metadata\.path\)/);
  assert.match(browserNavigation, /setAttribute\("aria-expanded"/);
  assert.match(browserNavigation, /addEventListener\("toggle", syncExpandedState\)/);

  for (const retired of [
    '{ key: "projects", href: "/projects/", label: "Projects" }',
    '{ key: "work", href: "/work/", label: "Work" }',
    'label: "Contact"',
    'label: "GitHub"'
  ]) {
    assert.ok(!chrome.includes(retired), `shared Header restored retired nav contract: ${retired}`);
  }
});

test("every generated page exposes exact desktop/mobile company navigation and approved fallback access", async () => {
  for (const relative of CANONICAL_PAGES.keys()) {
    const html = await readDist(relative);
    const primary = tagBlocks(html, "nav").find(({ attrs }) => attrs.get("aria-label") === "Primary");
    const mobile = tagBlocks(html, "nav").find(({ attrs }) => attrs.get("aria-label") === "Primary mobile");
    assert.ok(primary, `${relative} missing desktop primary navigation`);
    assert.ok(mobile, `${relative} missing mobile primary navigation`);

    for (const nav of [primary, mobile]) {
      assert.deepEqual(
        anchors(nav.inner).map((anchor) => [textContent(anchor.inner), anchor.href]),
        expectedNavigation.map(({ label, href }) => [label, href]),
        `${relative} navigation does not match the typed company contract`
      );
    }

    const current = anchors(primary.inner).filter((anchor) => anchor.attrs.get("aria-current") === "page");
    const route = CANONICAL_PAGES.get(relative);
    const expectedCurrent = route ? navigationSectionForPath(route) : "";
    assert.equal(current.length, expectedCurrent ? 1 : 0, `${relative} has incorrect aria-current count`);
    if (expectedCurrent) {
      assert.equal(current[0].href, expectedNavigation.find((item) => item.key === expectedCurrent)?.href);
    }

    const allAnchors = anchors(html);
    assert.ok(allAnchors.some((anchor) => anchor.href === "/" && anchor.attrs.get("aria-label") === "WizardGang home"), `${relative} missing WizardGang home link`);
    assert.ok(allAnchors.some((anchor) => anchor.href === "mailto:jacob@wizardgang.ai"), `${relative} missing contact access`);
    assert.ok(allAnchors.some((anchor) => anchor.href === "https://github.com/Wizard-Gang" && anchor.attrs.get("aria-label") === "Visit WizardGang on GitHub"), `${relative} missing organization GitHub access`);
  }
});

test("every primary navigation destination is a generated canonical page", async () => {
  for (const item of NAVIGATION_ITEMS) {
    const relative = `${item.href.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
    assert.ok(CANONICAL_PAGES.has(relative), `${item.href} is not in the generated canonical inventory`);
    await access(resolve("dist", relative));
  }
});

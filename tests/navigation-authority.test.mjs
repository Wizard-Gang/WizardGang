import assert from "node:assert/strict";
import test from "node:test";
import { NAVIGATION_ITEMS, navigationSectionForPath } from "../src/app/navigation.ts";
import { CANONICAL_PAGES, anchors, generatedHtmlFiles, readDist, readRoot, tagBlocks, textContent } from "./helpers.mjs";

const expected = [
  ["Capabilities", "/#capabilities"],
  ["Integrations", "/#integrations"],
  ["About", "/#about"]
];

test("navigation has three root fragment destinations", async () => {
  assert.deepEqual(NAVIGATION_ITEMS.map(({ label, href }) => [label, href]), expected);
  for (const route of ["/", "/solutions/", "/projects/", "/projects/hexframe/", "/about/", "/404/"]) {
    assert.equal(navigationSectionForPath(route), "", `path ${route} cannot identify a scroll fragment`);
  }
  const home = await readDist("index.html");
  for (const [, href] of expected) {
    const id = href.split("#")[1];
    assert.match(home, new RegExp(`<section\\b[^>]*\\bid="${id}"`), `no section for ${href}`);
  }
});

test("shared header uses direct anchors rather than hover menus", async () => {
  const chrome = await readRoot("src/components/SiteChrome.tsx");
  const browser = await readRoot("src/browser/navigation.ts");
  assert.match(chrome, /import \{ NAVIGATION_ITEMS \} from "\.\.\/app\/navigation"/);
  assert.doesNotMatch(chrome, /nav-item-menu|nav-menu-caret|PROJECT_MENU/);
  assert.match(chrome, /type="button"/);
  assert.match(chrome, /aria-controls=\{MOBILE_NAVIGATION_ID\}/);
  assert.match(browser, /mobileNav\.hidden/);
  assert.match(browser, /setAttribute\("aria-expanded"/);
  assert.match(browser, /toggle\.addEventListener\("click"/);
});

test("desktop and no-JS mobile navigation link to the same homepage sections", async () => {
  for (const relative of await generatedHtmlFiles()) {
    const html = await readDist(relative);
    for (const label of ["Primary", "Primary mobile"]) {
      const nav = tagBlocks(html, "nav").find(({ attrs }) => attrs.get("aria-label") === label);
      assert.ok(nav, `${relative}: missing ${label}`);
      assert.deepEqual(anchors(nav.inner).map(a => [textContent(a.inner), a.href]), expected);
      assert.doesNotMatch(nav.inner, /aria-current="location"/);
    }
    const links = anchors(html);
    assert.ok(links.some(a => a.href === "/" && a.attrs.get("aria-label") === "WizardGang home"));
    assert.ok(!links.some(a => a.href.startsWith("mailto:")), "portfolio has no direct email links");
    assert.ok(links.some(a => a.href === "https://github.com/Wizard-Gang/wizardgang-architecture-demo" && a.attrs.get("aria-label") === "Demo source on GitHub"));
    assert.ok(links.some(a => a.href === "https://demo.wizardgang.ai" && a.attrs.get("aria-label") === "Architecture demo"));
    assert.ok(!links.some(a => a.href === "https://github.com/Wizard-Gang"), "the organization profile is no longer linked from pages");
  }
  assert.deepEqual([...CANONICAL_PAGES.keys()], ["index.html", "sl/index.html", "404.html"]);
});

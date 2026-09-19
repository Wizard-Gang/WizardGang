import assert from "node:assert/strict";
import test from "node:test";
import {
  CANONICAL_PAGES,
  anchors,
  readDist,
  readRoot,
  startTags,
  tagBlocks,
  textContent
} from "./helpers.mjs";

test("every canonical page is complete static HTML composed through the React shell", async (t) => {
  for (const relative of CANONICAL_PAGES.keys()) {
    await t.test(relative, async () => {
      const html = await readDist(relative);
      assert.match(html, /^<!doctype html>/i);
      assert.equal(startTags(html, "html").length, 1);
      assert.equal(tagBlocks(html, "head").length, 1);
      assert.equal(tagBlocks(html, "body").length, 1);
      assert.equal(startTags(html, "header").filter(({ attrs }) => attrs.get("class") === "site-header").length, 1);
      assert.equal(startTags(html, "footer").filter(({ attrs }) => attrs.get("class") === "site-footer").length, 1);
      assert.equal(startTags(html, "main").filter(({ attrs }) => attrs.get("id") === "main").length, 1);
      assert.doesNotMatch(html, /data-wizardgang-legacy-body/);
      assert.doesNotMatch(html, /id=["']root["']|react-dom\/client|hydrateRoot|createRoot/);
      assert.doesNotMatch(html, /<script\b[^>]*type=["']module["'][^>]*>/i);
    });
  }
});

test("React owns Header, navigation, Preferences, Footer, and metadata while legacy code owns page bodies only", async () => {
  const documentSource = await readRoot("src/app/Document.tsx");
  const chromeSource = await readRoot("src/components/SiteChrome.tsx");
  const legacySource = await readRoot("src/site.mjs");

  assert.match(documentSource, /<html lang="en">/);
  assert.match(documentSource, /<Metadata /);
  assert.match(documentSource, /<SiteHeader /);
  assert.match(documentSource, /<Preferences \/>/);
  assert.match(documentSource, /<SiteFooter /);
  assert.match(documentSource, /renderToStaticMarkup/);

  for (const signal of ["WizardGang home", "Primary mobile", "Preferences", "page-language", "theme-dark", "text-size-200", "play-previews", "Software engineering portfolio", "/version.json"]) {
    assert.ok(chromeSource.includes(signal), `React shell is missing shared contract: ${signal}`);
  }

  assert.match(legacySource, /createPageDefinitions/);
  assert.match(legacySource, /<main\b/);
  assert.doesNotMatch(legacySource, /function\s+(?:header|displaySettings|footer|document)\b/);
  assert.doesNotMatch(legacySource, /class=["'](?:site-header|display-settings|site-footer)/);
});

test("the static shell keeps the legacy browser behavior contract without loading React in the browser", async () => {
  const html = await readDist("index.html");
  const scriptTags = startTags(html, "script");
  assert.equal(scriptTags.length, 1, "shared shell should load only the existing browser behavior script");
  assert.match(scriptTags[0].attrs.get("src") || "", /^\/assets\/site\.js\?v=/);
  assert.ok(scriptTags[0].attrs.has("defer"));
  assert.ok(!scriptTags[0].attrs.has("type"));

  for (const id of ["page-language", "theme-dark", "theme-light", "reading-layout", "text-size-200", "play-previews", "motion-setting-help"]) {
    assert.equal(startTags(html, "input").concat(startTags(html, "select"), startTags(html, "small")).some(({ attrs }) => attrs.get("id") === id), true, `missing browser-script control ${id}`);
  }

  const nav = tagBlocks(html, "nav").find(({ attrs }) => attrs.get("aria-label") === "Primary");
  assert.ok(nav);
  assert.deepEqual(
    anchors(nav.inner).map((anchor) => textContent(anchor.inner)),
    ["Projects", "Work", "About", "Contact", "GitHub"]
  );
});

test("build metadata remains visible in the React footer and version record", async () => {
  const html = await readDist("index.html");
  const version = JSON.parse(await readDist("version.json"));
  const footer = tagBlocks(html, "footer")[0];
  assert.ok(footer);
  const buildLink = anchors(footer.inner).find((anchor) => anchor.href === "/version.json");
  assert.ok(buildLink);
  assert.equal(textContent(buildLink.inner), `Build ${version.commit}`);
});

test("the transitional body seam is singular and documented rather than spread through components", async () => {
  const documentSource = await readRoot("src/app/Document.tsx");
  const chromeSource = await readRoot("src/components/SiteChrome.tsx");
  const combined = `${documentSource}\n${chromeSource}`;

  assert.equal((combined.match(/data-wizardgang-legacy-body/g) || []).length, 2, "placeholder declaration and template marker should be the only body-boundary references");
  assert.doesNotMatch(combined, /dangerouslySetInnerHTML/);
  assert.match(documentSource, /WG-041 transitional boundary/);
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  CANONICAL_PAGES,
  anchors,
  findAnchor,
  readDist,
  readRoot,
  startTags,
  tagBlocks,
  textContent
} from "./helpers.mjs";

const navDestinations = new Map([
  ["Projects", "/projects/"],
  ["Work", "/work/"],
  ["About", "/about/"],
  ["Contact", "mailto:jacob@wizardgang.ai"],
  ["GitHub", "https://github.com/Wizard-Gang"]
]);

function normalizedVisible(anchor) {
  return textContent(anchor.inner).replace(/[↗→]/g, "").replace(/\s+/g, " ").trim();
}

function currentNavDestination(relative) {
  if (relative.startsWith("projects/")) return "/projects/";
  if (relative === "work/index.html") return "/work/";
  if (relative === "about/index.html") return "/about/";
  return null;
}

function cssVariables(block) {
  const vars = new Map();
  for (const match of block.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-f]{3,8})\s*;/gi)) vars.set(match[1], match[2]);
  return vars;
}

function rgb(hex) {
  const value = hex.slice(1);
  const full = value.length === 3 ? [...value].map((c) => c + c).join("") : value.slice(0, 6);
  return [0, 2, 4].map((offset) => Number.parseInt(full.slice(offset, offset + 2), 16) / 255);
}

function luminance(hex) {
  const channels = rgb(hex).map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const [bright, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (bright + 0.05) / (dark + 0.05);
}

test("shared shell is protected by semantics rather than serialized markup", async (t) => {
  for (const relative of CANONICAL_PAGES.keys()) {
    await t.test(relative, async () => {
      const html = await readDist(relative);
      const pageAnchors = anchors(html);

      const skip = pageAnchors.find((anchor) => /^Skip to main content$/i.test(normalizedVisible(anchor)));
      assert.ok(skip, "missing skip navigation");
      assert.equal(skip.href, "#main");
      assert.ok(startTags(html, "main").some(({ attrs }) => attrs.get("id") === "main"), "skip-link target #main is missing");

      const primary = tagBlocks(html, "nav").find(({ attrs }) => attrs.get("aria-label") === "Primary");
      assert.ok(primary, "missing primary navigation landmark");
      for (const [name, href] of navDestinations) {
        const link = anchors(primary.inner).find((anchor) => anchor.href === href && normalizedVisible(anchor) === name);
        assert.ok(link, `primary navigation missing ${name} -> ${href}`);
      }

      const currentExpected = currentNavDestination(relative);
      const currentLinks = anchors(primary.inner).filter((anchor) => anchor.attrs.get("aria-current") === "page");
      if (currentExpected) {
        assert.equal(currentLinks.length, 1, "current route should expose one aria-current link");
        assert.equal(currentLinks[0].href, currentExpected);
      }

      const disclosures = tagBlocks(html, "details");
      const mobileDisclosure = disclosures.find(({ inner }) => tagBlocks(inner, "nav").some(({ attrs }) => attrs.get("aria-label") === "Primary mobile"));
      assert.ok(mobileDisclosure, "mobile navigation must remain a native keyboard-operable disclosure");
      assert.ok(tagBlocks(mobileDisclosure.inner, "summary").some(({ inner }) => /Menu/i.test(textContent(inner))), "mobile navigation disclosure needs a summary control");
      const mobile = tagBlocks(mobileDisclosure.inner, "nav").find(({ attrs }) => attrs.get("aria-label") === "Primary mobile");
      for (const [, href] of navDestinations) assert.ok(anchors(mobile.inner).some((anchor) => anchor.href === href), `mobile navigation missing ${href}`);

      const home = pageAnchors.find((anchor) => anchor.href === "/" && anchor.attrs.get("aria-label") === "WizardGang home");
      assert.ok(home, "wordmark must retain a named home relationship");

      const footer = tagBlocks(html, "footer");
      assert.equal(footer.length, 1, "page must expose one footer landmark");
      assert.ok(findAnchor(footer[0].inner, (anchor) => anchor.href === "mailto:jacob@wizardgang.ai" && /jacob@wizardgang\.ai/i.test(normalizedVisible(anchor))));
      assert.ok(findAnchor(footer[0].inner, (anchor) => /linkedin\.com\/in\/jacob-yongue/i.test(anchor.href) && /LinkedIn/i.test(normalizedVisible(anchor))));
      assert.ok(findAnchor(footer[0].inner, (anchor) => anchor.href === "/version.json" && /^Build /i.test(normalizedVisible(anchor))));

      for (const retired of ["Website services", "Compliance", "Glossary"]) {
        assert.ok(!anchors(footer[0].inner).some((anchor) => normalizedVisible(anchor) === retired), `footer must not restore retired ${retired} link`);
      }
      assert.doesNotMatch(footer[0].inner, /View build metadata/i);

      assert.doesNotMatch(html, /\starget\s*=\s*["']_blank["']/i);
      assert.equal(startTags(html, "style").length, 0);
      assert.doesNotMatch(html, /\sstyle\s*=/i);
    });
  }
});

test("language, theme, readable-layout, 200% text, and preview-motion controls remain available on every page", async (t) => {
  for (const relative of CANONICAL_PAGES.keys()) {
    await t.test(relative, async () => {
      const html = await readDist(relative);
      const ids = new Map();
      for (const tagName of ["input", "select", "small", "section"]) {
        for (const tag of startTags(html, tagName)) if (tag.attrs.get("id")) ids.set(tag.attrs.get("id"), tag);
      }
      for (const id of ["page-language", "theme-dark", "theme-light", "reading-layout", "text-size-200", "play-previews", "motion-setting-help"]) {
        assert.ok(ids.has(id), `missing preference control ${id}`);
      }
      assert.match(html, />English</);
      assert.match(html, />Español</);
      assert.ok(tagBlocks(html, "summary").some(({ inner }) => /^Preferences$/i.test(textContent(inner))), "preferences disclosure is missing");
      assert.equal(ids.get("theme-dark").attrs.get("type"), "radio");
      assert.ok(ids.get("theme-dark").attrs.has("checked"), "dark theme remains the default");
      assert.equal(ids.get("theme-light").attrs.get("type"), "radio");
      assert.equal(ids.get("reading-layout").attrs.get("type"), "checkbox");
      assert.equal(ids.get("text-size-200").attrs.get("type"), "checkbox");
      assert.equal(ids.get("play-previews").attrs.get("type"), "checkbox");
      assert.ok(ids.get("play-previews").attrs.has("checked"), "preview motion remains play-by-default");
      assert.equal(ids.get("play-previews").attrs.get("aria-describedby"), "motion-setting-help");
      assert.match(html, /Previews play by default\. Turn this off to pause them; reduced-motion preferences are always respected\./);
    });
  }
});

test("compact project actions keep destination-specific accessible names without depending on classes", async (t) => {
  for (const relative of CANONICAL_PAGES.keys()) {
    await t.test(relative, async () => {
      const html = await readDist(relative);
      if (relative === "index.html" || relative.startsWith("projects/")) {
        const main = tagBlocks(html, "main").find(({ attrs }) => attrs.get("id") === "main");
        assert.ok(main, "project action checks require the primary main landmark");
        for (const anchor of anchors(main.inner)) {
          const visible = normalizedVisible(anchor).toLowerCase();
          if (!["play", "case study", "github", "evidence"].includes(visible)) continue;
          const aria = anchor.attrs.get("aria-label") || "";
          assert.ok(aria.length > visible.length + 4, `${visible} action must identify its destination`);
          if (visible === "play") assert.match(aria, /^Play .+/i);
          if (visible === "case study") assert.match(aria, /case study/i);
          if (visible === "github") assert.match(aria, /source code on GitHub/i);
          if (visible === "evidence") assert.match(aria, /evidence|operations/i);
        }
      }
    });
  }
});

test("project previews remain excluded from the accessibility tree while useful descriptions stay outside them", async () => {
  for (const relative of ["index.html", "projects/index.html", "projects/sharktank/index.html", "projects/hexframe/index.html", "projects/yarreader/index.html"]) {
    const html = await readDist(relative);
    const decorative = startTags(html, "div").filter(({ attrs }) => attrs.get("aria-hidden") === "true" && attrs.has("inert"));
    assert.ok(decorative.length >= (relative.endsWith("index.html") && ["index.html", "projects/index.html"].includes(relative) ? 3 : 1), `${relative}: preview must remain decorative and inert`);
  }
  const projects = await readDist("projects/index.html");
  assert.doesNotMatch(projects, /<animate(?:Transform)?\b/i, "SVG previews must not add uncontrolled SMIL motion");
  assert.doesNotMatch(projects, /<text\b/i, "decorative SVG previews must not duplicate text content");
});

test("CSS exposes preference behavior, mobile open state, target sizing, reduced motion, and safe preview flashing", async () => {
  const styles = await readDist("assets/styles.css");

  // These control-linked selectors are intentional seams: CSS itself implements the behavior,
  // so checking the public control state is more durable than checking animation/keyframe names.
  assert.match(styles, /\.project-visual\s*\*\s*\{[^}]*animation-play-state:\s*paused\s*!important(?:;|\})/s);
  assert.match(styles, /body:has\(#play-previews:checked\)\s+\.project-visual\s*\*\s*\{[^}]*animation-play-state:\s*running\s*!important(?:;|\})/s);
  assert.match(styles, /html:has\(#text-size-200:checked\)\s*\{[^}]*font-size:\s*200%/s);
  assert.match(styles, /body:has\(#theme-light:checked\)\s*\{/);
  assert.match(styles, /\.nav-disclosure\[open\]\s+\.site-nav\s*\{[^}]*display:\s*flex/s);

  const accessibleTargets = [...styles.matchAll(/min-height:\s*(44|48)px\b/g)];
  assert.ok(accessibleTargets.length >= 6, "interactive controls should retain the current accessible target-size intent");

  const reducedMotionMarkers = [...styles.matchAll(/@media\s*\(prefers-reduced-motion:\s*reduce\)/g)];
  assert.ok(reducedMotionMarkers.length >= 1, "reduced-motion behavior must remain present in the emitted stylesheet");
  const previewReduced = styles.slice(reducedMotionMarkers[0].index);
  assert.match(previewReduced, /\.tank-fish[\s\S]*animation:\s*none/);
  assert.match(previewReduced, /\.lab-playhead[\s\S]*animation:\s*none/);

  const flame = styles.match(/\.tank-rocket-flame\s*\{[^}]*animation:\s*[^;}]*?([\d.]+)s[^;}]*(?:;|\})/s);
  assert.ok(flame, "preview flash behavior must remain explicitly timed");
  assert.ok(Number(flame[1]) >= 1 / 3, "preview flash timing must remain below three flashes per second");
});

test("dark and light preference palettes retain readable text and visible focus contrast", async () => {
  const styles = await readDist("assets/styles.css");
  const darkBlock = styles.match(/:root\s*\{([\s\S]*?)\}/)?.[1] || "";
  const lightBlock = styles.match(/body:has\(#theme-light:checked\)\s*\{([\s\S]*?)\}/)?.[1] || "";
  const dark = cssVariables(darkBlock);
  const light = cssVariables(lightBlock);
  for (const [name, palette] of [["dark", dark], ["light", light]]) {
    const background = palette.get("ink");
    for (const token of ["paper", "muted"]) {
      assert.ok(contrast(palette.get(token), background) >= 4.5, `${name} ${token} text must retain at least 4.5:1 contrast`);
    }
    assert.ok(contrast(palette.get("focus"), background) >= 3, `${name} focus indicator must retain at least 3:1 contrast`);
  }
});

test("TypeScript browser source preserves language and persisted display/motion behavior", async () => {
  const script = [await readRoot("src/browser/preferences.ts"), await readRoot("src/browser/navigation.ts"), await readRoot("src/browser/index.ts"), await readRoot("src/browser/translations.ts")].join("\n");
  for (const signal of [
    "wizardgang.preferences.v1",
    "Español",
    "Jugar",
    "Caso de estudio",
    "Pautas de Accesibilidad para el Contenido Web",
    "Informar de un problema"
  ]) assert.match(script, new RegExp(signal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(script, /storage\.getItem\(STORAGE_KEY\)/);
  assert.match(script, /storage\.setItem\(STORAGE_KEY/);
  assert.match(script, /documentRoot\.documentElement\.lang\s*=\s*locale/);
  assert.match(script, /shouldCloseForEscape\(event\.key, disclosure\.open\)/);
  assert.match(script, /isAnchorActivationTarget\(event\.target\)/);
  assert.ok((script.match(/setNavigationOpen\(disclosure, false\)/g) || []).length >= 2, "Escape and link activation must close mobile navigation");
  for (const key of ["language", "theme", "reading", "text", "motion", "motionExplicit"]) assert.match(script, new RegExp(`\\b${key}\\b`));
  assert.match(script, /controls\.motion\.addEventListener\(["']change["'][\s\S]*motionExplicit\s*=\s*true/);
});

test("preview-motion documentation and browser help agree on play-by-default behavior", async () => {
  const script = await readRoot("src/browser/translations.ts");
  const record = await readRoot("docs/ACCESSIBILITY.md");
  assert.match(script, /Project previews play by default; pause them with the Play previews control\./);
  assert.match(record, /play-by-default preview motion/i);
  assert.doesNotMatch(script, /paused[- ]by[- ]default|animations (?:are|están) pausad/i);
  assert.doesNotMatch(record, /paused[- ]by[- ]default|animations (?:are|están) pausad/i);
});

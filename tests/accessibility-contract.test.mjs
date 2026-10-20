import assert from "node:assert/strict";
import test from "node:test";
import {
  anchors,
  generatedHtmlFiles,
  findAnchor,
  readDist,
  readRoot,
  startTags,
  tagBlocks,
  textContent
} from "./helpers.mjs";

// All navigation links move within the one canonical document.
const navLinks = new Map([
  ["Services", "/#services"],
  ["Experience", "/#experience"],
  ["About", "/#about"],
  ["Contact", "/#contact"]
]);

function normalizedVisible(anchor) {
  return textContent(anchor.inner).replace(/[↗→]/g, "").replace(/\s+/g, " ").trim();
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

test("every generated page receives baseline structural accessibility checks", async (t) => {
  const files = await generatedHtmlFiles();
  const pageTitles = new Map();

  for (const relative of files) {
    await t.test(relative, async () => {
      const html = await readDist(relative);
      const htmlTag = startTags(html, "html")[0];
      assert.equal(htmlTag?.attrs.get("lang"), "en", "static document language must be declared");

      const titles = tagBlocks(html, "title");
      assert.equal(titles.length, 1, "page must expose one title");
      const title = textContent(titles[0].inner);
      assert.ok(title.length >= 3, "page title must be meaningful");
      pageTitles.set(relative, title);

      const mains = tagBlocks(html, "main");
      assert.equal(mains.length, 1, "page must expose one main landmark");
      assert.equal(mains[0].attrs.get("id"), "main", "shared skip target must stay on the main landmark");

      const h1 = tagBlocks(html, "h1");
      assert.equal(h1.length, 1, "page must expose exactly one h1");
      assert.ok(textContent(h1[0].inner).length >= 3, "h1 must be meaningful");

      const headingLevels = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));
      for (let index = 1; index < headingLevels.length; index += 1) {
        assert.ok(
          headingLevels[index] <= headingLevels[index - 1] + 1,
          `heading level skips from h${headingLevels[index - 1]} to h${headingLevels[index]}`
        );
      }

      const ids = [...html.matchAll(/\sid=(?:"([^"]+)"|'([^']+)')/gi)].map((match) => match[1] ?? match[2]);
      assert.equal(new Set(ids).size, ids.length, "duplicate document ids are not allowed");
      const idSet = new Set(ids);

      const skipIndex = html.indexOf('class="skip-link"');
      assert.ok(skipIndex >= 0 && skipIndex < html.indexOf("<header") && skipIndex < html.indexOf("<main"), "skip link must appear before header/main content");

      for (const match of html.matchAll(/\stabindex=(?:"(-?\d+)"|'(-?\d+)')/gi)) {
        assert.ok(Number(match[1] ?? match[2]) <= 0, "positive tabindex is not allowed");
      }

      for (const anchor of anchors(html)) {
        assert.doesNotMatch(anchor.href, /^javascript:/i, "javascript: links are not allowed");
        if (anchor.href.startsWith("#")) {
          const raw = anchor.href.slice(1);
          let fragment = raw;
          try { fragment = decodeURIComponent(raw); } catch {}
          assert.ok(idSet.has(fragment), `same-page fragment does not resolve: ${anchor.href}`);
        }
        assert.doesNotMatch(anchor.inner, /<(?:button|input|select|textarea|summary)\b/i, "links must not contain nested interactive controls");
      }

      for (const button of tagBlocks(html, "button")) {
        const name = button.attrs.get("aria-label") || textContent(button.inner);
        assert.ok(name.trim().length > 0, "buttons require an accessible name");
        assert.doesNotMatch(button.inner, /<(?:a|input|select|textarea|summary)\b/i, "buttons must not contain nested interactive controls");
      }

      for (const image of startTags(html, "img")) {
        assert.ok(image.attrs.has("alt"), "every img requires explicit alt semantics");
      }

      for (const match of html.matchAll(/\saria-(?:controls|describedby)=(?:"([^"]+)"|'([^']+)')/gi)) {
        for (const id of (match[1] ?? match[2]).split(/\s+/).filter(Boolean)) {
          assert.ok(idSet.has(id), `ARIA relationship references missing id ${id}`);
        }
      }
    });
  }

  assert.equal(new Set(pageTitles.values()).size, pageTitles.size, "canonical pages require distinct document titles");
});

test("shared shell is protected by semantics rather than serialized markup", async (t) => {
  for (const relative of await generatedHtmlFiles()) {
    await t.test(relative, async () => {
      const html = await readDist(relative);
      const pageAnchors = anchors(html);

      const skip = pageAnchors.find((anchor) => /^Skip to main content$/i.test(normalizedVisible(anchor)));
      assert.ok(skip, "missing skip navigation");
      assert.equal(skip.href, "#main");
      assert.ok(startTags(html, "main").some(({ attrs }) => attrs.get("id") === "main"), "skip-link target #main is missing");

      const primary = tagBlocks(html, "nav").find(({ attrs }) => attrs.get("aria-label") === "Primary");
      assert.ok(primary, "missing primary navigation landmark");
      for (const [name, href] of navLinks) {
        const link = anchors(primary.inner).find((anchor) => anchor.href === href && normalizedVisible(anchor) === name);
        assert.ok(link, `primary navigation missing ${name} -> ${href}`);
      }
      assert.doesNotMatch(primary.inner, /nav-item-menu|nav-menu-caret/, "single-page navigation must not expose submenus");
      assert.equal([...primary.inner.matchAll(/aria-current="location"/g)].length, 0,
        "path-based rendering must not claim that a scroll section is current");
      for (const retiredLabel of ["Work", "Projects", "Solutions", "Software", "Glossary", "GitHub"]) {
        assert.ok(!anchors(primary.inner).some(anchor => normalizedVisible(anchor) === retiredLabel),
          `navigation must not restore ${retiredLabel}`);
      }

      const mobileToggle = tagBlocks(html, "button").find(({ attrs }) => (attrs.get("class") || "").split(/\s+/).includes("nav-toggle"));
      assert.ok(mobileToggle, "mobile navigation requires a real button control");
      assert.equal(mobileToggle.attrs.get("type"), "button");
      assert.equal(mobileToggle.attrs.get("aria-expanded"), "false");
      assert.equal(mobileToggle.attrs.get("aria-controls"), "primary-mobile-navigation");
      assert.ok(mobileToggle.attrs.has("hidden"), "menu button stays hidden until browser enhancement is available");
      assert.match(textContent(mobileToggle.inner), /Menu/i);

      const mobile = tagBlocks(html, "nav").find(({ attrs }) => attrs.get("id") === "primary-mobile-navigation");
      assert.ok(mobile, "mobile navigation controlled element is missing");
      assert.equal(mobile.attrs.get("aria-label"), "Primary mobile");
      assert.equal(mobile.attrs.has("hidden"), false, "static HTML keeps mobile navigation available without JavaScript");
      const mobileHrefs = new Set(anchors(mobile.inner).map((anchor) => anchor.href));
      for (const href of navLinks.values()) {
        assert.ok(mobileHrefs.has(href), `mobile navigation missing ${href}`);
      }

      const home = pageAnchors.find((anchor) => anchor.href === "/" && anchor.attrs.get("aria-label") === "WizardGang home");
      assert.ok(home, "wordmark must retain a named home relationship");

      const footer = tagBlocks(html, "footer");
      assert.equal(footer.length, 1, "page must expose one footer landmark");
      assert.ok(findAnchor(footer[0].inner, (anchor) => anchor.href === "mailto:jacob@wizardgang.ai" && /jacob@wizardgang\.ai/i.test(normalizedVisible(anchor))));
      assert.ok(findAnchor(footer[0].inner, (anchor) => /linkedin\.com\/in\/jacob-yongue/i.test(anchor.href) && /LinkedIn/i.test(normalizedVisible(anchor))));
      assert.ok(findAnchor(footer[0].inner, (anchor) => anchor.href === "https://github.com/Wizard-Gang" && anchor.attrs.get("aria-label") === "Visit WizardGang on GitHub"));
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

test("language, theme, readable layout and text enlargement remain on every page", async (t) => {
  for (const relative of await generatedHtmlFiles()) {
    await t.test(relative, async () => {
      const html = await readDist(relative);
      const ids = new Map();
      for (const tagName of ["input", "select", "small", "section"]) {
        for (const tag of startTags(html, tagName)) if (tag.attrs.get("id")) ids.set(tag.attrs.get("id"), tag);
      }
      for (const id of ["page-language", "theme-dark", "theme-light", "reading-layout", "text-size-200"]) {
        assert.ok(ids.has(id), `missing preference control ${id}`);
      }
      assert.match(html, />English</);
      assert.match(html, />Español</);
      // The band became a gear: the control is an icon, so its name is the label.
      const gear = tagBlocks(html, "summary").find(({ attrs }) => /preferences/i.test(attrs.get("aria-label") || ""));
      assert.ok(gear, "preferences disclosure is missing");
      assert.match(gear.attrs.get("aria-label") || "", /preferences/i, "the gear needs an accessible name");
      assert.equal(textContent(gear.inner), "", "the gear is an icon, so its name comes from aria-label");
      assert.equal(ids.get("theme-dark").attrs.get("type"), "radio");
      assert.ok(ids.get("theme-dark").attrs.has("checked"), "dark theme remains the default");
      assert.equal(ids.get("theme-light").attrs.get("type"), "radio");
      assert.equal(ids.get("reading-layout").attrs.get("type"), "checkbox");
      assert.equal(ids.get("text-size-200").attrs.get("type"), "checkbox");

    });
  }
});

test("contact action and one-page fragments retain accessible destinations", async () => {
  const html = await readDist("index.html");
  const main = tagBlocks(html, "main")[0]?.inner ?? "";
  for (const id of ["services", "experience", "about", "contact"]) {
    assert.match(main, new RegExp(`id="${id}"`));
  }
  assert.ok(anchors(main).some(a => a.href === "mailto:jacob@wizardgang.ai"));
});

test("the single-page document includes no animated product preview", async () => {
  const home = await readDist("index.html");
  assert.equal(startTags(home, "div").filter(({ attrs }) => attrs.has("data-preview-id")).length, 0);
  assert.doesNotMatch(home, /<animate(?:Transform)?\b/i);
  assert.doesNotMatch(home, /<text\b/i);
});

test("CSS exposes preference behavior, mobile open state, target sizing, and reduced motion", async () => {
  const styles = await readDist("assets/styles.css");

  assert.doesNotMatch(styles, /\.project-visual|\.lab-playhead|\.nav-item-menu/,
    "the single-page stylesheet must not contain removed preview and menu rules");
  assert.match(styles, /html:has\(#text-size-200:checked\)\s*\{[^}]*font-size:\s*200%/s);
  assert.match(styles, /body:has\(#theme-light:checked\)\s*\{/);
  assert.match(styles, /\.nav-toggle:not\(\[hidden\]\)\s*\{[^}]*display:\s*inline-flex/s);
  assert.match(styles, /\.nav-disclosure\s+\.site-nav-mobile:not\(\[hidden\]\)\s*\{[^}]*display:\s*flex/s);

  const accessibleTargets = [...styles.matchAll(/min-height:\s*(44|48)px\b/g)];
  assert.ok(accessibleTargets.length >= 6, "interactive controls should retain the current accessible target-size intent");

  const reducedMotionMarkers = [...styles.matchAll(/@media\s*\(prefers-reduced-motion:\s*reduce\)/g)];
  assert.ok(reducedMotionMarkers.length >= 1, "reduced-motion behavior must remain present in the emitted stylesheet");
  const reduced = styles.slice(reducedMotionMarkers[0].index);
  assert.match(reduced, /scroll-behavior:\s*auto/);

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

test("browser preserves Spanish, saved display preferences and mobile interaction", async () => {
  const script = [
    await readRoot("src/browser/preferences.ts"),
    await readRoot("src/browser/navigation.ts"),
    await readRoot("src/browser/index.ts"),
    await readRoot("src/browser/translations.ts")
  ].join("\n");
  for (const word of ["wizardgang.preferences.v1", "Español", "Servicios", "Experiencia", "Contacto"]) {
    assert.ok(script.includes(word), `missing browser language/control contract ${word}`);
  }
  assert.match(script, /storage\.getItem\(STORAGE_KEY\)/);
  assert.match(script, /storage\.setItem\(STORAGE_KEY/);
  assert.match(script, /documentRoot\.documentElement\.lang\s*=\s*locale/);
  assert.match(script, /shouldCloseForEscape\(event\.key, navigationIsOpen\(toggle\)\)/);
  assert.match(script, /isAnchorActivationTarget\(event\.target\)/);
  assert.doesNotMatch(script, /controls\.motion|motionExplicit|#play-previews|Play previews/);
});

test("accessibility documentation describes current single-page navigation", async () => {
  const record = await readRoot("docs/ACCESSIBILITY.md");
  const home = await readDist("index.html");
  assert.match(record, /mobile menu/i);
  assert.match(record, /reduced-motion/i);
  assert.doesNotMatch(home, /data-preview-id/);
});

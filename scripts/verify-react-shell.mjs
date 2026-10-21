import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const readRoot = (path) => readFile(resolve(root, path), "utf8");

const documentSource = await readRoot("src/app/Document.tsx");
const chromeSource = await readRoot("src/components/SiteChrome.tsx");
const registrySource = await readRoot("src/app/pageRegistry.ts");
const navigationSource = await readRoot("src/app/navigation.ts");
const homeSource = await readRoot("src/pages/Home.tsx");
const notFoundSource = await readRoot("src/pages/NotFound.tsx");
const tokens = await readRoot("src/styles/tokens.css");
const styles = await readRoot("src/styles/globals.css");
const home = await readRoot("dist/index.html");

assert.match(documentSource, /renderToStaticMarkup/);
assert.match(documentSource, /createStaticPageRegistry/);
assert.match(documentSource, /sitemapPaths/);
assert.doesNotMatch(documentSource, /legacy-body|dangerouslySetInnerHTML|react-dom\/client|hydrateRoot|createRoot/);
assert.match(chromeSource, /Skip to main content/);
assert.match(chromeSource, /Primary mobile/);
assert.match(chromeSource, /NAVIGATION_ITEMS/);
assert.match(chromeSource, /Preferences/);
assert.match(chromeSource, /WizardGang · Software, systems &amp; integrations/);

for (const label of ["Services", "Integrations", "About"]) {
  assert.match(navigationSource, new RegExp(`label: "${label}"`));
}
assert.doesNotMatch(navigationSource, /PROJECT_MENU|SOLUTIONS_MENU|\/projects\//);

for (const source of [homeSource, notFoundSource]) {
  for (const signal of ["ReactPageDefinition", "relative:", "metadata:", "body:"]) {
    assert.ok(source.includes(signal), `page lacks ${signal}`);
  }
}
assert.match(registrySource, /HOME_PAGE/);
assert.match(registrySource, /NOT_FOUND_PAGE/);
assert.doesNotMatch(registrySource, /ABOUT_PAGE|SOLUTIONS_PAGE|PROJECTS_PAGE|createCaseStudyPageDefinitions/);
assert.match(tokens, /@font-face/);
assert.match(tokens, /--text-display/);
assert.match(styles, /@import "\.\/tokens\.css";/);
assert.doesNotMatch(styles, /font-size: clamp\([\d.]+rem, [\d.]+vw, (?:[5-9]|\d\d)[\d.]*rem\)/);

assert.match(home, /^<!doctype html>/i);
assert.match(home, /<html\b[^>]*lang="en"/i);
assert.match(home, /<header\b[^>]*class="site-header"/i);
assert.match(home, /<footer\b[^>]*class="site-footer"/i);
assert.match(home, /<main\b[^>]*id="main"/i);
for (const fragment of ["services", "integrations", "about"]) {
  assert.ok(home.includes(`id="${fragment}"`), `missing #${fragment}`);
}
assert.doesNotMatch(home, /data-wizardgang-legacy-body|id="root"|react-dom\/client|hydrateRoot|createRoot/);
assert.doesNotMatch(home, /href="mailto:/, "a portfolio cannot expose direct email links");

const browserModule = home.match(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/i)?.[1] ?? "";
assert.match(browserModule, /^\/assets\/browser-[A-Za-z0-9_-]+\.js$/);
const bundle = await readRoot(`dist/${browserModule.slice(1)}`);
assert.doesNotMatch(bundle, /react-dom|hydrateRoot|createRoot/);

for (const path of [
  "src/pages/About.tsx", "src/pages/CaseStudy.tsx", "src/pages/Projects.tsx",
  "src/pages/Solutions.tsx", "src/components/ProfessionalSurfaces.tsx",
  "src/components/ProjectPreviews.tsx", "src/components/ProjectSurfaces.tsx",
  "src/data/projects.ts", "src/data/solutions-menu.ts", "src/data/capabilities.ts",
  "src/app/foundation/main.tsx", "scripts/verify-frontend-foundation.mjs",
  "public/assets/site.js", "public/sitemap.xml", "src/site.mjs",
  "src/styles.css", "src/portfolio-cleanup.css", "src/data/services.ts",
  "src/data/glossary.ts", "src/pages/Work.tsx", "src/pages/Services.tsx",
  "src/pages/Contact.tsx", "src/pages/Glossary.tsx", "src/pages/CompanyNavigation.tsx"
]) {
  await assert.rejects(access(resolve(root, path)), { code: "ENOENT" });
}

console.log("Verified single-page React/TypeScript authority and retired presentation removal.");

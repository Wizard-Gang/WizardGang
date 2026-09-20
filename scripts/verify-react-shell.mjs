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
const projectDataSource = await readRoot("src/data/projects.ts");
const professionalDataSource = await readRoot("src/data/professional.ts");
const professionalSystemsSource = await readRoot("src/data/professional-systems.ts");
const integrationDataSource = await readRoot("src/data/integrations.ts");
const homePageSource = await readRoot("src/pages/Home.tsx");
const workPageSource = await readRoot("src/pages/Work.tsx");
const servicesPageSource = await readRoot("src/pages/Services.tsx");
const aboutPageSource = await readRoot("src/pages/About.tsx");
const contactPageSource = await readRoot("src/pages/Contact.tsx");
const notFoundPageSource = await readRoot("src/pages/NotFound.tsx");
const tokensSource = await readRoot("src/styles/tokens.css");
const stylesSource = await readRoot("src/styles/globals.css");
const home = await readRoot("dist/index.html");

assert.match(documentSource, /renderToStaticMarkup/, "React server rendering must own static document composition");
assert.match(documentSource, /createStaticPageRegistry/, "typed React page registry must own static page generation");
assert.match(documentSource, /sitemapPaths/, "the sitemap must remain a projection of the page registry");
assert.doesNotMatch(documentSource, /legacy-body|renderDocument\(|dangerouslySetInnerHTML/, "legacy body compatibility rendering must be gone");
assert.doesNotMatch(documentSource, /react-dom\/client|hydrateRoot|createRoot/, "the shared shell must not require client React hydration");

assert.match(chromeSource, /Skip to main content/);
assert.match(chromeSource, /Primary mobile/);
assert.match(chromeSource, /Preferences/);
assert.match(chromeSource, /NAVIGATION_ITEMS/);
assert.match(chromeSource, /WizardGang · Software, systems &amp; integrations/);

for (const label of ["Work", "Services", "About", "Contact"]) {
  assert.match(navigationSource, new RegExp(`label: "${label}"`), `navigation must expose ${label}`);
}

const pageSources = [homePageSource, workPageSource, servicesPageSource, aboutPageSource, contactPageSource, notFoundPageSource];
for (const pageSource of pageSources) {
  assert.match(pageSource, /ReactPageDefinition/);
  assert.match(pageSource, /relative:/);
  assert.match(pageSource, /metadata:/);
  assert.match(pageSource, /body:/);
}

for (const importName of ["HOME_PAGE", "WORK_PAGE", "SERVICES_PAGE", "ABOUT_PAGE", "CONTACT_PAGE", "NOT_FOUND_PAGE"]) {
  assert.ok(registrySource.includes(importName), `static page registry missing ${importName}`);
}
assert.doesNotMatch(
  registrySource,
  /pages\/(?:Projects|Solutions|Glossary|CompanyNavigation)/,
  "page modules retired by the five-page cut must not return to the registry"
);

assert.match(projectDataSource, /export const projects/, "TypeScript project data must remain authoritative");
assert.match(workPageSource, /projects\.map/, "the work page must render every project from the typed authority");
assert.match(aboutPageSource, /ProfessionalRoleGrid/, "About must render the typed professional role authority");
assert.match(integrationDataSource, /export const integrationCategories/, "TypeScript integration capability data must remain authoritative");
assert.match(servicesPageSource, /integrationCategories/, "Services must consume the typed integration authority");
assert.match(professionalDataSource, /export const professionalRoles/, "TypeScript professional role data must remain authoritative");
assert.match(professionalDataSource, /export const professionalSkills/, "TypeScript professional skill data must remain authoritative");
assert.match(professionalSystemsSource, /export const deployments/, "TypeScript deployment evidence must remain authoritative");

// The design system is one place. tokens.css declares values; globals.css uses them.
assert.match(tokensSource, /@font-face/, "tokens.css owns the self-hosted faces");
assert.match(tokensSource, /--text-display/, "tokens.css owns the type scale");
assert.match(stylesSource, /@import "\.\/tokens\.css";/, "the presentation authority must consume the token authority");
assert.doesNotMatch(
  stylesSource,
  /font-size: clamp\([\d.]+rem, [\d.]+vw, (?:[5-9]|\d\d)[\d.]*rem\)/,
  "headings must resolve to the shared type scale rather than a bespoke display size"
);

assert.match(home, /^<!doctype html>/i);
assert.match(home, /<html\b[^>]*lang="en"/i);
assert.match(home, /<header\b[^>]*class="site-header"/i);
assert.match(home, /<footer\b[^>]*class="site-footer"/i);
assert.match(home, /<main\b[^>]*id="main"/i);
assert.doesNotMatch(home, /data-wizardgang-legacy-body|data-wizardgang-selected-projects|data-wizardgang-selected-work/);
assert.doesNotMatch(home, /id="root"|react-dom\/client|hydrateRoot|createRoot/, "production HTML must not expose a React client mount contract");

const browserModule = home.match(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/i)?.[1] ?? "";
assert.match(browserModule, /^\/assets\/browser-[A-Za-z0-9_-]+\.js$/, "production HTML must reference the Vite browser entry");
const browserBundle = await readRoot(`dist/${browserModule.slice(1)}`);
assert.doesNotMatch(browserBundle, /react-dom|hydrateRoot|createRoot/, "browser behavior must remain independent of React runtime");

for (const path of [
  "src/app/foundation/main.tsx",
  "scripts/verify-frontend-foundation.mjs",
  "public/assets/site.js",
  "public/sitemap.xml",
  "src/projects.mjs",
  "src/professional.mjs",
  "src/professional-systems.mjs",
  "src/site.mjs",
  "src/styles.css",
  "src/portfolio-cleanup.css",
  "src/data/services.ts",
  "src/data/glossary.ts",
  "src/pages/Projects.tsx",
  "src/pages/Solutions.tsx",
  "src/pages/Glossary.tsx",
  "src/pages/CompanyNavigation.tsx"
]) {
  await assert.rejects(access(resolve(root, path)), { code: "ENOENT" });
}

console.log("Verified React/TypeScript authority and absence of retired presentation sources.");

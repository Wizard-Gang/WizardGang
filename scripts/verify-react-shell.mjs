import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const readRoot = (path) => readFile(resolve(root, path), "utf8");

const documentSource = await readRoot("src/app/Document.tsx");
const chromeSource = await readRoot("src/components/SiteChrome.tsx");
const registrySource = await readRoot("src/app/pageRegistry.ts");
const projectPagesSource = await readRoot("src/pages/Projects.tsx");
const projectDataSource = await readRoot("src/data/projects.ts");
const professionalDataSource = await readRoot("src/data/professional.ts");
const professionalSystemsSource = await readRoot("src/data/professional-systems.ts");
const homePageSource = await readRoot("src/pages/Home.tsx");
const aboutPageSource = await readRoot("src/pages/About.tsx");
const companyNavigationPageSource = await readRoot("src/pages/CompanyNavigation.tsx");
const navigationSource = await readRoot("src/app/navigation.ts");
const servicesPageSource = await readRoot("src/pages/Services.tsx");
const glossaryPageSource = await readRoot("src/pages/Glossary.tsx");
const notFoundPageSource = await readRoot("src/pages/NotFound.tsx");
const home = await readRoot("dist/index.html");

assert.match(documentSource, /renderToStaticMarkup/, "React server rendering must own static document composition");
assert.match(documentSource, /createStaticPageRegistry/, "typed React page registry must own static page generation");
assert.doesNotMatch(documentSource, /legacy-body|renderDocument\(|dangerouslySetInnerHTML/, "legacy body compatibility rendering must be gone");
assert.doesNotMatch(documentSource, /react-dom\/client|hydrateRoot|createRoot/, "the shared shell must not require client React hydration");
assert.match(chromeSource, /Skip to main content/);
assert.match(chromeSource, /Primary mobile/);
assert.match(chromeSource, /Preferences/);
assert.match(chromeSource, /NAVIGATION_ITEMS/);
assert.match(navigationSource, /About/);
assert.match(navigationSource, /Software/);
assert.match(navigationSource, /Solutions/);
assert.match(chromeSource, /WizardGang · Software, systems &amp; integrations/);

for (const pageSource of [homePageSource, aboutPageSource, companyNavigationPageSource, servicesPageSource, glossaryPageSource, notFoundPageSource]) {
  assert.match(pageSource, /ReactPageDefinition/);
  assert.match(pageSource, /relative:/);
  assert.match(pageSource, /metadata:/);
  assert.match(pageSource, /body:/);
}
for (const importName of ["HOME_PAGE", "ABOUT_PAGE", "COMPANY_PAGE", "TEAM_PAGE", "JACOB_TEAM_PAGE", "SOFTWARE_PAGE", "SOFTWARE_INTEGRATIONS_PAGE", "SOLUTIONS_PAGE", "SERVICES_PAGE", "GLOSSARY_PAGE", "NOT_FOUND_PAGE", "createProjectPageDefinitions"]) {
  assert.ok(registrySource.includes(importName), `static page registry missing ${importName}`);
}
assert.match(projectPagesSource, /createProjectPageDefinitions/, "React project route definitions must remain authoritative");
assert.match(projectDataSource, /export const projects/, "TypeScript project data must remain authoritative");
assert.match(aboutPageSource, /ProfessionalRoleGrid/, "Jacob Team page must render the typed professional role authority");
assert.match(aboutPageSource, /SystemGroups/, "Jacob Team page must render typed system evidence");
assert.match(aboutPageSource, /IntegrationGroups/, "Jacob Team page must render typed integration evidence");
assert.doesNotMatch(registrySource, /createWorkPageDefinitions|pages\/Work/, "redirect-only Work must not remain a static page authority");
assert.match(professionalDataSource, /export const professionalRoles/, "TypeScript professional role data must remain authoritative");
assert.match(professionalDataSource, /export const professionalSkills/, "TypeScript professional skill data must remain authoritative");
assert.match(professionalSystemsSource, /export const integrationGroups/, "TypeScript integration data must remain authoritative");
assert.match(professionalSystemsSource, /export const systemGroups/, "TypeScript system data must remain authoritative");
assert.match(professionalSystemsSource, /export const deployments/, "TypeScript deployment data must remain authoritative");

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
  "src/projects.mjs",
  "src/professional.mjs",
  "src/professional-systems.mjs",
  "src/site.mjs",
  "src/styles.css",
  "src/portfolio-cleanup.css",
  "src/pages/Work.tsx"
]) {
  await assert.rejects(access(resolve(root, path)), { code: "ENOENT" });
}

console.log("Verified React/TypeScript authority and absence of retired presentation sources.");

import type { ReactPageDefinition } from "./contracts";
import { ABOUT_PAGE, COMPANY_PAGE, JACOB_TEAM_PAGE, TEAM_PAGE } from "../pages/About";
import { SOFTWARE_INTEGRATIONS_PAGE, SOFTWARE_PAGE } from "../pages/CompanyNavigation";
import { GLOSSARY_PAGE } from "../pages/Glossary";
import { HOME_PAGE } from "../pages/Home";
import { NOT_FOUND_PAGE } from "../pages/NotFound";
import { createProjectPageDefinitions } from "../pages/Projects";
import { DEMO_FRAMEWORK_PAGE, SOLUTIONS_PAGE, WEBSITES_SOLUTION_PAGE } from "../pages/Solutions";

export function createStaticPageRegistry(): readonly ReactPageDefinition[] {
  const pages = [
    HOME_PAGE,
    ...createProjectPageDefinitions(),
    ABOUT_PAGE,
    COMPANY_PAGE,
    TEAM_PAGE,
    JACOB_TEAM_PAGE,
    SOFTWARE_PAGE,
    SOFTWARE_INTEGRATIONS_PAGE,
    SOLUTIONS_PAGE,
    WEBSITES_SOLUTION_PAGE,
    DEMO_FRAMEWORK_PAGE,
    GLOSSARY_PAGE,
    NOT_FOUND_PAGE
  ];

  const outputs = new Set<string>();
  for (const page of pages) {
    if (outputs.has(page.relative)) throw new Error(`Duplicate generated route: ${page.relative}`);
    outputs.add(page.relative);
  }

  return pages;
}

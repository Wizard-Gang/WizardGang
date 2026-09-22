import type { ReactPageDefinition } from "./contracts";
import { ABOUT_PAGE } from "../pages/About";
import { HOME_PAGE } from "../pages/Home";
import { NOT_FOUND_PAGE } from "../pages/NotFound";
import { PROJECTS_PAGE } from "../pages/Projects";
import { SOLUTIONS_PAGE } from "../pages/Solutions";
import { createCaseStudyPageDefinitions } from "../pages/CaseStudy";

export function createStaticPageRegistry(): readonly ReactPageDefinition[] {
  const pages = [
    HOME_PAGE,
    SOLUTIONS_PAGE,
    PROJECTS_PAGE,
    ...createCaseStudyPageDefinitions(),
    ABOUT_PAGE,
    NOT_FOUND_PAGE
  ];

  const outputs = new Set<string>();
  for (const page of pages) {
    if (outputs.has(page.relative)) throw new Error(`Duplicate generated route: ${page.relative}`);
    outputs.add(page.relative);
  }

  return pages;
}

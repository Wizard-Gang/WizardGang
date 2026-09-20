import type { ReactPageDefinition } from "./contracts";
import { ABOUT_PAGE } from "../pages/About";
import { HOME_PAGE } from "../pages/Home";
import { NOT_FOUND_PAGE } from "../pages/NotFound";
import { createCaseStudyPageDefinitions } from "../pages/CaseStudy";
import { createSolutionPageDefinitions } from "../pages/Solutions";

export function createStaticPageRegistry(): readonly ReactPageDefinition[] {
  const pages = [
    HOME_PAGE,
    ...createCaseStudyPageDefinitions(),
    ...createSolutionPageDefinitions(),
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

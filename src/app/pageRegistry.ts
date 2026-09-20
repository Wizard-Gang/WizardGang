import type { ReactPageDefinition } from "./contracts";
import { ABOUT_PAGE } from "../pages/About";
import { CONTACT_PAGE } from "../pages/Contact";
import { HOME_PAGE } from "../pages/Home";
import { NOT_FOUND_PAGE } from "../pages/NotFound";
import { SERVICES_PAGE } from "../pages/Services";
import { WORK_PAGE } from "../pages/Work";

export function createStaticPageRegistry(): readonly ReactPageDefinition[] {
  const pages = [HOME_PAGE, WORK_PAGE, SERVICES_PAGE, ABOUT_PAGE, CONTACT_PAGE, NOT_FOUND_PAGE];

  const outputs = new Set<string>();
  for (const page of pages) {
    if (outputs.has(page.relative)) throw new Error(`Duplicate generated route: ${page.relative}`);
    outputs.add(page.relative);
  }

  return pages;
}

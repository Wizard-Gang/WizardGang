import type { ReactPageDefinition } from "./contracts";
import { HOME_PAGE } from "../pages/Home";
import { NOT_FOUND_PAGE } from "../pages/NotFound";
import { SRI_LANKA_PAGE } from "../pages/SriLanka";

export function createStaticPageRegistry(): readonly ReactPageDefinition[] {
  const pages = [HOME_PAGE, SRI_LANKA_PAGE, NOT_FOUND_PAGE];
  const outputs = new Set<string>();
  for (const page of pages) {
    if (outputs.has(page.relative)) throw new Error(`Duplicate generated route: ${page.relative}`);
    outputs.add(page.relative);
  }
  return pages;
}

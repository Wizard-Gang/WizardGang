import type { NavigationItem, PrimaryNavigationSection } from "./contracts";
import { PROJECT_MENU } from "../data/projects.ts";
import { SOLUTION_MENU } from "../data/solutions-menu.ts";

export const NAVIGATION_ITEMS = [
  { key: "software", href: PROJECT_MENU[0].href, label: "Software", items: PROJECT_MENU },
  { key: "solutions", href: SOLUTION_MENU[0].href, label: "Solutions", items: SOLUTION_MENU },
  { key: "about", href: "/about/", label: "About" }
] as const satisfies readonly NavigationItem[];

const SECTION_ROOTS: Record<PrimaryNavigationSection, string> = {
  software: "/software/",
  solutions: "/solutions/",
  about: "/about/"
};

export function navigationSectionForPath(path: string): PrimaryNavigationSection | "" {
  for (const [key, root] of Object.entries(SECTION_ROOTS)) {
    if (path === root || path.startsWith(root)) return key as PrimaryNavigationSection;
  }
  return "";
}

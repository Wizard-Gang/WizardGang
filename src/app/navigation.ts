import type { NavigationItem, PrimaryNavigationSection } from "./contracts";
import { PROJECT_MENU } from "../data/projects.ts";
import { SOLUTIONS_PATH } from "../data/solutions-menu.ts";

export const NAVIGATION_ITEMS = [
  { key: "solutions", href: SOLUTIONS_PATH, label: "Solutions" },
  { key: "projects", href: PROJECT_MENU[0].href, label: "Projects", items: PROJECT_MENU },
  { key: "about", href: "/about/", label: "About" }
] as const satisfies readonly NavigationItem[];

const SECTION_ROOTS: Record<PrimaryNavigationSection, string> = {
  solutions: "/solutions/",
  projects: "/projects/",
  about: "/about/"
};

export function navigationSectionForPath(path: string): PrimaryNavigationSection | "" {
  for (const [key, root] of Object.entries(SECTION_ROOTS)) {
    if (path === root || path.startsWith(root)) return key as PrimaryNavigationSection;
  }
  return "";
}

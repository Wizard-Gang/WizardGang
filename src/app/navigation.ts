import type { NavigationItem, PrimaryNavigationSection } from "./contracts";

export const NAVIGATION_ITEMS = [
  { key: "about", href: "/about/", label: "About" },
  { key: "software", href: "/software/", label: "Software" },
  { key: "solutions", href: "/solutions/", label: "Solutions" }
] as const satisfies readonly NavigationItem[];

export function navigationSectionForPath(path: string): PrimaryNavigationSection | "" {
  for (const item of NAVIGATION_ITEMS) {
    if (path === item.href || path.startsWith(item.href)) return item.key;
  }
  return "";
}

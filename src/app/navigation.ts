import type { NavigationItem, PrimaryNavigationSection } from "./contracts";

export const NAVIGATION_ITEMS = [
  { key: "work", href: "/work/", label: "Work" },
  { key: "services", href: "/services/", label: "Services" },
  { key: "about", href: "/about/", label: "About" },
  { key: "contact", href: "/contact/", label: "Contact" }
] as const satisfies readonly NavigationItem[];

export function navigationSectionForPath(path: string): PrimaryNavigationSection | "" {
  for (const item of NAVIGATION_ITEMS) {
    if (path === item.href || path.startsWith(item.href)) return item.key;
  }
  return "";
}

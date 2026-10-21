import type { NavigationItem, CurrentNavSection } from "./contracts";

// One public document. Navigation remains real fragments in static HTML.
export const NAVIGATION_ITEMS = [
  { key: "services", href: "/#services", label: "Services" },
  { key: "integrations", href: "/#integrations", label: "Integrations" },
  { key: "about", href: "/#about", label: "About" }
] as const satisfies readonly NavigationItem[];

export function navigationSectionForPath(_path: string): CurrentNavSection {
  return "";
}

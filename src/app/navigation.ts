import type { NavigationItem, CurrentNavSection } from "./contracts";

// One public document. Navigation remains real fragments in static HTML.
export const NAVIGATION_ITEMS = [
  { key: "capabilities", href: "/#capabilities", label: "Capabilities" },
  { key: "integrations", href: "/#integrations", label: "Integrations" },
  { key: "about", href: "/#about", label: "About" }
] as const satisfies readonly NavigationItem[];

export function navigationSectionForPath(_path: string): CurrentNavSection {
  return "";
}

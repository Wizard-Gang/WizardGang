import type { NavigationItem, CurrentNavSection } from "./contracts";

// The root page is the only public company document; every navigation link
// targets a real section there, including from the generated 404.
export const NAVIGATION_ITEMS = [
  { key: "services", href: "/#services", label: "Services" },
  { key: "experience", href: "/#experience", label: "Experience" },
  { key: "about", href: "/#about", label: "About" },
  { key: "contact", href: "/#contact", label: "Contact" }
] as const satisfies readonly NavigationItem[];

// A path alone cannot identify the reader's current scroll fragment.
export function navigationSectionForPath(_path: string): CurrentNavSection {
  return "";
}

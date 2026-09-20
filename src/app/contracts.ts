import type { ReactElement } from "react";

export interface BuildMetadata {
  product: string;
  commit: string;
  builtAt: string;
}

export type PrimaryNavigationSection = "work" | "services" | "about" | "contact";
export type CurrentNavSection = PrimaryNavigationSection | "";

export interface NavigationItem {
  label: string;
  href: string;
  key?: PrimaryNavigationSection;
  accessibleName?: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  socialImage?: string;
}

export interface PageDefinition {
  metadata: PageMetadata;
  body: string;
}

export interface ReactPageDefinition {
  relative: string;
  metadata: PageMetadata;
  body: ReactElement;
}

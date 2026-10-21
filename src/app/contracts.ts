import type { ReactElement } from "react";

export interface BuildMetadata {
  product: string;
  release: string;
  commit: string;
  builtAt: string;
}

export type PrimaryNavigationSection = "services" | "integrations" | "about";
export type CurrentNavSection = PrimaryNavigationSection | "";

export interface NavigationLink {
  label: string;
  href: string;
  accessibleName?: string;
}

export interface NavigationItem extends NavigationLink {
  key: PrimaryNavigationSection;
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

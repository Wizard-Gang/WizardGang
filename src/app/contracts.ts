import type { ReactElement } from "react";

export interface BuildMetadata {
  product: string;
  commit: string;
  builtAt: string;
}

export type PrimaryNavigationSection = "software" | "solutions" | "about";
export type CurrentNavSection = PrimaryNavigationSection | "";

export interface NavigationLink {
  label: string;
  href: string;
  accessibleName?: string;
}

/** A primary item is either a direct link or a menu of links. */
export interface NavigationItem extends NavigationLink {
  key: PrimaryNavigationSection;
  items?: readonly NavigationLink[];
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

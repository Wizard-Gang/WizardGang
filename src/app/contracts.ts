import type { ReactElement } from "react";

export interface BuildMetadata {
  product: string;
  commit: string;
  builtAt: string;
}

export type CurrentNavSection = "projects" | "work" | "about" | "services" | "glossary" | "";

export interface NavigationItem {
  label: string;
  href: string;
  key?: "projects" | "work" | "about";
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
  current: CurrentNavSection;
  body: string;
}

export interface ReactPageDefinition {
  relative: string;
  metadata: PageMetadata;
  current: CurrentNavSection;
  body: ReactElement;
}

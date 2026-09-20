/** The Solutions menu. Each entry is the public view of one professional-evidence
    authority in src/data/professional-systems.ts. */
export type SolutionSlug = "industries" | "integrations" | "deployments";

export interface SolutionPage {
  slug: SolutionSlug;
  label: string;
  title: string;
  lede: string;
}

export const SOLUTION_PAGES = [
  {
    slug: "industries",
    label: "Industries",
    title: "Industries",
    lede: "The operational domains this practice has actually shipped into."
  },
  {
    slug: "integrations",
    label: "Integrations",
    title: "Integrations",
    lede: "Systems connected in production, with the vendor each one belongs to."
  },
  {
    slug: "deployments",
    label: "Deployments",
    title: "Deployments",
    lede: "Organizations running systems this practice delivered or supported."
  }
] as const satisfies readonly SolutionPage[];

export function solutionPath(slug: SolutionSlug): `/solutions/${SolutionSlug}/` {
  return `/solutions/${slug}/`;
}

export function solutionOutputPath(slug: SolutionSlug): `solutions/${SolutionSlug}/index.html` {
  return `solutions/${slug}/index.html`;
}

export const SOLUTION_MENU: readonly { label: string; href: string; accessibleName?: string }[] =
  SOLUTION_PAGES.map((page) => ({ label: page.label, href: solutionPath(page.slug) }));

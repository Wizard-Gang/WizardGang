/** Solutions is one page with three sections, each projecting one
    professional-evidence authority from src/data/professional-systems.ts. */
export const SOLUTIONS_PATH = "/solutions/" as const;

export type SolutionSection = "industries" | "integrations" | "deployments";

export interface SolutionSectionDefinition {
  id: SolutionSection;
  label: string;
  lede: string;
}

export const SOLUTION_SECTIONS = [
  {
    id: "industries",
    label: "Industries",
    lede: "The operational domains this work has shipped into."
  },
  {
    id: "integrations",
    label: "Integrations",
    lede: "Systems connected in production, with the vendor each one belongs to."
  },
  {
    id: "deployments",
    label: "Deployments",
    lede: "Organizations where these systems went live, and what was delivered."
  }
] as const satisfies readonly SolutionSectionDefinition[];

export function solutionAnchor(id: SolutionSection): `/solutions/#${SolutionSection}` {
  return `/solutions/#${id}`;
}

/** The Solutions menu. Capabilities leads, as it does on the page. */
export const SOLUTION_MENU: readonly { label: string; href: string; accessibleName?: string }[] = [
  { label: "Capabilities", href: "/solutions/#capabilities" },
  ...SOLUTION_SECTIONS.map((section) => ({ label: section.label, href: solutionAnchor(section.id) }))
];

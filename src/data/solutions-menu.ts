/** Solutions leads with WizardGang capabilities, then three sections drawn from
    Jacob Yongue's professional record in src/data/professional-systems.ts. */
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
    lede: "Industries delivered to, and the work done in each."
  },
  {
    id: "integrations",
    label: "Integrations",
    lede: "Systems connected in production, and who makes them."
  },
  {
    id: "deployments",
    label: "Deployments",
    lede: "Organizations running this software, and what was built for them."
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

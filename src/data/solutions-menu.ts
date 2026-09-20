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

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  summary: string;
  profilePath: string;
  professionalPath: string;
}

export const TEAM_MEMBERS = [
  {
    slug: "jacob",
    name: "Jacob Yongue",
    role: "Software engineer / implementation lead",
    summary: "Builds WizardGang software and brings professional experience across application development, integrations, QA, deployment, training, and production support.",
    profilePath: "/about/team/jacob/",
    professionalPath: "/work/"
  }
] as const satisfies readonly TeamMember[];

export const JACOB_TEAM_MEMBER = TEAM_MEMBERS[0];

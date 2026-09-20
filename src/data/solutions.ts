export const SOLUTIONS_ROOT_PATH = "/solutions/" as const;
export const WEBSITES_SOLUTION_PATH = "/solutions/websites/" as const;
export const DEMO_FRAMEWORK_PATH = "/solutions/demo-framework/" as const;
export const DEMO_FRAMEWORK_URL = "https://demo.wizardgang.ai" as const;

export type SolutionId = "websites" | "demo-framework";
export type SolutionSlug = SolutionId;

export interface SolutionRecord {
  id: SolutionId;
  slug: SolutionSlug;
  name: string;
  summary: string;
  description: string;
  path: `/solutions/${SolutionSlug}/`;
  externalUrl?: string;
}

export function solutionPath(slug: SolutionSlug): `/solutions/${SolutionSlug}/` {
  return `/solutions/${slug}/`;
}

export const websitesSolution = {
  id: "websites",
  slug: "websites",
  name: "Websites",
  summary: "Fixed-scope websites with owner-controlled source, repository, deployment, domain, and documented handoff.",
  description: "WizardGang builds small-business websites as software the owner can see, control, move, and continue without a required platform subscription.",
  path: WEBSITES_SOLUTION_PATH,
  externalUrl: undefined
} as const satisfies SolutionRecord;

export const demoFrameworkSolution = {
  id: "demo-framework",
  slug: "demo-framework",
  name: "Demo Framework",
  summary: "A reusable architecture and delivery framework that keeps requirements, changes, validation, releases, deployment, and operating evidence inspectable.",
  description: "WizardGang uses the Demo Framework to show how architecture, controlled delivery, verification, assurance, and operations can stay connected without turning the company site into an engineering dashboard.",
  path: DEMO_FRAMEWORK_PATH,
  externalUrl: DEMO_FRAMEWORK_URL
} as const satisfies SolutionRecord;

export const solutions = [
  websitesSolution,
  demoFrameworkSolution
] as const satisfies readonly SolutionRecord[];

export const solutionById = new Map<SolutionId, SolutionRecord>(
  solutions.map((solution) => [solution.id, solution] as const)
);

export interface WebsitePackage {
  name: string;
  price: string;
  pages: string;
  description: string;
  features: readonly string[];
}

export const WEBSITE_PACKAGES = [
  {
    name: "Starter",
    price: "$95",
    pages: "Up to 3 pages",
    description: "A focused site for a small business that needs a credible home, clear services, and a direct contact path.",
    features: ["Responsive design", "Home, services, and contact routes", "Direct email and contact details", "Owner-controlled source and deployment"]
  },
  {
    name: "Business",
    price: "$195",
    pages: "Up to 5 pages",
    description: "A broader business site with room to show the work, establish trust, and collect useful customer inquiries.",
    features: ["Everything in Starter", "Gallery and testimonial sections", "Service-area content", "First-party contact form"]
  },
  {
    name: "Owner+",
    price: "$350",
    pages: "Up to 8 pages",
    description: "A complete site with dedicated pages, stored contact requests, and documentation for future maintenance.",
    features: ["Everything in Business", "FAQ and expanded content routes", "Stored contact submissions", "AI-ready documentation and automated deployment"]
  }
] as const satisfies readonly WebsitePackage[];

export interface DemoFrameworkStep {
  id: "requirement" | "change" | "validation" | "release" | "deployment" | "operation";
  name: string;
  description: string;
}

export const DEMO_FRAMEWORK_PROCESS = [
  {
    id: "requirement",
    name: "Requirement",
    description: "State the behavior, boundary, or operating need the software must satisfy."
  },
  {
    id: "change",
    name: "Change",
    description: "Implement one scoped, traceable change inside the documented architecture and control boundaries."
  },
  {
    id: "validation",
    name: "Validation",
    description: "Use automated checks and focused evidence to verify behavior, accessibility, security, and release readiness where applicable."
  },
  {
    id: "release",
    name: "Release",
    description: "Identify an accepted product state with an annotated semantic-version tag and GitHub Release."
  },
  {
    id: "deployment",
    name: "Deployment",
    description: "Deploy the exact released state through controlled automation and verify the resulting production identity."
  },
  {
    id: "operation",
    name: "Operation",
    description: "Keep runtime status, bounded operational evidence, recovery boundaries, and version identity inspectable after release."
  }
] as const satisfies readonly DemoFrameworkStep[];

export interface DemoFrameworkArea {
  id: "architecture" | "demos" | "assurance" | "security" | "operations";
  name: string;
  description: string;
}

export const DEMO_FRAMEWORK_AREAS = [
  {
    id: "architecture",
    name: "Inspectable architecture",
    description: "A documented TypeScript, Cloudflare, GitHub, identity, API, data, accessibility, and governance baseline with explicit system boundaries."
  },
  {
    id: "demos",
    name: "Executable demonstrations",
    description: "Focused proof for data, APIs, integrations, identity, AI/MCP, edge runtime behavior, accessibility, and internationalization."
  },
  {
    id: "assurance",
    name: "Assurance examples",
    description: "Structured assessment work for ISO/IEC 27001, ISO/IEC 42001, and WCAG 2.2, presented as aligned or assessed evidence rather than certification."
  },
  {
    id: "security",
    name: "Security boundary",
    description: "A public vulnerability-reporting and advisory surface separated from protected administration and operational machine contracts."
  },
  {
    id: "operations",
    name: "Operational proof",
    description: "Compact public service, availability, release, and source identity backed by deeper machine contracts instead of a duplicated public dashboard."
  }
] as const satisfies readonly DemoFrameworkArea[];

export function validateSolutions(): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const paths = new Set<string>();

  for (const solution of solutions) {
    if (!solution.id.trim() || !solution.name.trim() || !solution.summary.trim() || !solution.description.trim()) {
      throw new Error(`Incomplete solution record: ${solution.id}`);
    }
    if (ids.has(solution.id)) throw new Error(`Duplicate solution id: ${solution.id}`);
    if (slugs.has(solution.slug)) throw new Error(`Duplicate solution slug: ${solution.slug}`);
    if (paths.has(solution.path)) throw new Error(`Duplicate solution path: ${solution.path}`);
    ids.add(solution.id);
    slugs.add(solution.slug);
    paths.add(solution.path);
    if (solution.path !== solutionPath(solution.slug)) throw new Error(`Invalid solution path: ${solution.id}`);
    if (solution.externalUrl && new URL(solution.externalUrl).protocol !== "https:") {
      throw new Error(`Solution external URL must use HTTPS: ${solution.id}`);
    }
  }

  const stepIds = DEMO_FRAMEWORK_PROCESS.map((step) => step.id);
  if (new Set(stepIds).size !== stepIds.length) throw new Error("Duplicate Demo Framework process step id");
  for (const step of DEMO_FRAMEWORK_PROCESS) {
    if (!step.name.trim() || !step.description.trim()) {
      throw new Error(`Incomplete Demo Framework process step: ${step.id}`);
    }
  }

  const areaIds = DEMO_FRAMEWORK_AREAS.map((area) => area.id);
  if (new Set(areaIds).size !== areaIds.length) throw new Error("Duplicate Demo Framework area id");
  for (const area of DEMO_FRAMEWORK_AREAS) {
    if (!area.name.trim() || !area.description.trim()) {
      throw new Error(`Incomplete Demo Framework area: ${area.id}`);
    }
  }
}

validateSolutions();

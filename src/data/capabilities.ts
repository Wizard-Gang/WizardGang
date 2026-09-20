/* What WizardGang can demonstrate, and where to watch it run.
 *
 * Unlike the rest of Solutions, this is WizardGang's own capability rather than
 * professional history, so it carries no employer attribution. Every destination
 * is a fragment on the architecture demo that actually exists; the anchors were
 * taken from the running application, not invented here. */

export const DEMO_ORIGIN = "https://demo.wizardgang.ai" as const;

export interface CapabilityProof {
  name: string;
  detail: string;
  href: string;
}

export interface CapabilityGroup {
  title: string;
  summary: string;
  proofs: readonly CapabilityProof[];
}

const demos = (fragment: string) => `${DEMO_ORIGIN}/demos#${fragment}`;

export const capabilityGroups: readonly CapabilityGroup[] = [
  {
    title: "Data",
    summary: "Relational state and object storage, with metadata and bytes kept apart.",
    proofs: [
      { name: "D1", detail: "Relational state", href: demos("d1") },
      { name: "R2", detail: "Object storage", href: demos("r2") }
    ]
  },
  {
    title: "APIs",
    summary: "Documented request surfaces you can call from the page they are described on.",
    proofs: [
      { name: "REST / OpenAPI", detail: "Described and executable", href: demos("rest") },
      { name: "GraphQL", detail: "Schema and live queries", href: demos("graphql") }
    ]
  },
  {
    title: "Integrations",
    summary: "Machine-to-machine delivery with verifiable authenticity.",
    proofs: [{ name: "Signed webhooks", detail: "Signature verification", href: demos("webhooks") }]
  },
  {
    title: "Identity",
    summary: "Federated sign-in and the authorization boundary behind it.",
    proofs: [{ name: "OAuth / OIDC / SAML", detail: "Callback behavior", href: demos("identity") }]
  },
  {
    title: "AI / MCP",
    summary: "A Model Context Protocol endpoint an agent can actually connect to.",
    proofs: [{ name: "MCP endpoint", detail: "Tools and executable proof", href: demos("mcp") }]
  },
  {
    title: "Runtime",
    summary: "Where the code runs and what owns coordinated state.",
    proofs: [
      { name: "Edge", detail: "Request handling", href: demos("edge") },
      { name: "Workers", detail: "Application mediation", href: demos("workers") },
      { name: "Durable Objects", detail: "Coordinated state", href: demos("durable-objects") }
    ]
  },
  {
    title: "Quality",
    summary: "Accessibility and language behavior treated as contracts, not afterthoughts.",
    proofs: [
      { name: "Accessibility", detail: "WCAG 2.2 behavior", href: demos("accessibility") },
      { name: "Internationalization", detail: "Language handling", href: demos("i18n") }
    ]
  },
  {
    title: "Assurance",
    summary: "Framework assessments with recorded gaps. Aligned, not certified.",
    proofs: [{ name: "ISO 27001 · ISO 42001 · WCAG 2.2", detail: "Assessment records", href: `${DEMO_ORIGIN}/assurance` }]
  },
  {
    title: "Security",
    summary: "A stated disclosure boundary and how to report against it.",
    proofs: [{ name: "Vulnerability reporting", detail: "Advisory boundary", href: `${DEMO_ORIGIN}/security` }]
  }
];

export const capabilityProofCount = capabilityGroups.reduce((total, group) => total + group.proofs.length, 0);

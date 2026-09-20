import type { ReactPageDefinition } from "../app/contracts";
import { SOLUTIONS_PATH, SOLUTION_SECTIONS } from "../data/solutions-menu";
import {
  deployments,
  professionalIntegrationEvidence,
  professionalSystemEvidence
} from "../data/professional-systems";

/* One page, three sections. Everything here is professional work performed
   under an employer, not WizardGang client work, so each section says so in
   its own words rather than relying on a footnote somewhere else. */

const ATTRIBUTION = "Jacob Yongue's professional record. This work was delivered under the employers named, not under WizardGang.";

function Industries() {
  return (
    <div className="evidence-groups">
      {professionalSystemEvidence.map((group) => (
        <section className="evidence-group" key={group.title}>
          <h3>{group.title}</h3>
          <ul className="evidence-list" aria-label={group.title}>
            {group.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Integrations() {
  return (
    <div className="evidence-groups">
      {professionalIntegrationEvidence.map((group) => (
        <section className="evidence-group" key={group.title}>
          <h3>{group.title}</h3>
          <ul className="evidence-list evidence-links" aria-label={group.title}>
            {group.items.map((item) => (
              <li key={item.name}>
                {item.url ? (
                  <a href={item.url}>{item.name} <span aria-hidden="true">↗</span></a>
                ) : item.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Deployments() {
  return (
    <ul className="deployment-wall" aria-label="Organizations where these systems went live">
      {deployments.map((deployment) => (
        <li key={`${deployment.name}-${deployment.solution}`}>
          <a href={deployment.url}>
            <strong>{deployment.name} <span aria-hidden="true">↗</span></strong>
            <span>{deployment.solution}</span>
            <em>{deployment.employer}</em>
          </a>
        </li>
      ))}
    </ul>
  );
}

const SECTION_BODIES = { industries: Industries, integrations: Integrations, deployments: Deployments } as const;

const SECTION_COUNTS = {
  industries: `${professionalSystemEvidence.reduce((total, group) => total + group.items.length, 0)} capabilities across ${professionalSystemEvidence.length} domains`,
  integrations: `${professionalIntegrationEvidence.reduce((total, group) => total + group.items.length, 0)} systems across ${professionalIntegrationEvidence.length} groups`,
  deployments: `${deployments.length} organizations`
} as const;

export const SOLUTIONS_PAGE: ReactPageDefinition = {
  relative: "solutions/index.html",
  metadata: {
    title: "Solutions — WizardGang",
    description: "Jacob Yongue's professional record: the operational domains delivered into, the systems connected in production, and the organizations where those systems went live.",
    path: SOLUTIONS_PATH,
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <h1>Solutions</h1>
        <p>Where this work has actually run, what it connected to, and who it ran for.</p>
      </section>

      <p className="attribution-note" role="note">{ATTRIBUTION}</p>

      <nav className="work-jump" aria-label="Sections on this page">
        <ul>
          {SOLUTION_SECTIONS.map((section) => (
            <li key={section.id}><a href={`#${section.id}`}>{section.label}</a></li>
          ))}
        </ul>
      </nav>

      {SOLUTION_SECTIONS.map((section) => {
        const Body = SECTION_BODIES[section.id];
        return (
          <section className="solution-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-heading`}>
            <h2 id={`${section.id}-heading`}>{section.label}</h2>
            <p className="work-entry-lede">{section.lede}</p>
            <p className="evidence-count">{SECTION_COUNTS[section.id]}</p>
            <Body />
          </section>
        );
      })}
    </main>
  )
};

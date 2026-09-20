import type { ReactElement } from "react";
import type { ReactPageDefinition } from "../app/contracts";
import {
  SOLUTION_PAGES,
  solutionOutputPath,
  solutionPath,
  type SolutionSlug
} from "../data/solutions-menu";
import {
  deployments,
  professionalIntegrationEvidence,
  professionalSystemEvidence
} from "../data/professional-systems";

/* Solutions is the public view of the professional-evidence authorities: the
   domains worked in, the systems connected, and the organizations running them.
   The data lives in src/data/professional-systems.ts; these pages only project it. */

function Industries() {
  return (
    <div className="evidence-groups">
      {professionalSystemEvidence.map((group) => (
        <section className="evidence-group" key={group.title}>
          <h2>{group.title}</h2>
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
          <h2>{group.title}</h2>
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
    <ul className="deployment-wall" aria-label="Organizations running delivered systems">
      {deployments.map((deployment) => (
        <li key={deployment.name}>
          <a href={deployment.url}>{deployment.name} <span aria-hidden="true">↗</span></a>
        </li>
      ))}
    </ul>
  );
}

const BODIES: Record<SolutionSlug, () => ReactElement> = {
  industries: Industries,
  integrations: Integrations,
  deployments: Deployments
};

const COUNTS: Record<SolutionSlug, string> = {
  industries: `${professionalSystemEvidence.reduce((total, group) => total + group.items.length, 0)} capabilities across ${professionalSystemEvidence.length} domains`,
  integrations: `${professionalIntegrationEvidence.reduce((total, group) => total + group.items.length, 0)} systems across ${professionalIntegrationEvidence.length} groups`,
  deployments: `${deployments.length} organizations`
};

export function createSolutionPageDefinitions(): readonly ReactPageDefinition[] {
  return SOLUTION_PAGES.map((page) => {
    const Body = BODIES[page.slug];
    return {
      relative: solutionOutputPath(page.slug),
      metadata: {
        title: `${page.title} — WizardGang Solutions`,
        description: `${page.lede} ${COUNTS[page.slug]}.`,
        path: solutionPath(page.slug),
        socialImage: "/og.jpg"
      },
      body: (
        <main className="site-main" id="main" tabIndex={-1}>
          <section className="page-hero">
            <p className="kicker">Solutions</p>
            <h1>{page.title}</h1>
            <p>{page.lede}</p>
          </section>
          <p className="evidence-count">{COUNTS[page.slug]}</p>
          <Body />
        </main>
      )
    };
  });
}

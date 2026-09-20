import type { ReactPageDefinition } from "../app/contracts";
import { IntegrationCatalog } from "../components/IntegrationSurfaces";
import { INTEGRATIONS_PATH, integrationCategories } from "../data/integrations";
import { PROJECTS_ROOT_PATH } from "../data/projects";

export const SOFTWARE_PAGE: ReactPageDefinition = {
  relative: "software/index.html",
  metadata: {
    title: "Software — WizardGang",
    description: "WizardGang software: integration capability and independent projects with source, case studies, and live proof where available.",
    path: "/software/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="case-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <p className="kicker">Software</p>
        <h1>Software, systems,<br /><span>and integrations.</span></h1>
        <p>WizardGang builds inspectable software and works across the integration boundaries that connect systems, data, and operating workflows.</p>
      </section>
      <section className="case-section">
        <div className="case-label">Integrations</div>
        <div>
          <h2>Connect systems and workflows.</h2>
          <p>Explore the canonical WizardGang integration capability model, with professional evidence kept separately attributed.</p>
          <a className="text-link" href={INTEGRATIONS_PATH}>Explore integrations <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section className="case-section">
        <div className="case-label">Projects</div>
        <div>
          <h2>WizardGang software projects.</h2>
          <p>SharkTank, Hexframe, and YarReader pair concise project overviews with source, running surfaces where available, and deeper technical case studies.</p>
          <a className="text-link" href={PROJECTS_ROOT_PATH}>Explore projects <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
  )
};

export const SOFTWARE_INTEGRATIONS_PAGE: ReactPageDefinition = {
  relative: "software/integrations/index.html",
  metadata: {
    title: "Integrations — WizardGang Software",
    description: "WizardGang integration capability across APIs, enterprise systems, identity, data automation, and operational interfaces, with supporting evidence clearly attributed.",
    path: INTEGRATIONS_PATH,
    socialImage: "/og.jpg"
  },
  body: (
    <main className="case-main" id="main" tabIndex={-1}>
      <a className="crumb" href="/software/">← Software</a>
      <section className="page-hero">
        <p className="kicker">Software / Integrations</p>
        <h1>Connect systems.<br /><span>Keep ownership clear.</span></h1>
        <p>WizardGang presents integration capability as clear system, interface, and data boundaries. Professional experience supports that capability without turning prior employer or customer work into WizardGang client history.</p>
      </section>
      <section className="case-section" aria-labelledby="integration-groups-heading">
        <div className="case-label">Capability model</div>
        <div>
          <h2 id="integration-groups-heading">Five durable integration groups.</h2>
          <p>Capability is grouped by the kind of boundary being connected, not by a wall of vendor names or unrelated acronyms.</p>
          <nav aria-label="Integration capability groups">
            <ul className="reference-cloud">
              {integrationCategories.map((category) => (
                <li key={category.id}><a href={`#${category.id}`}>{category.name}</a></li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <IntegrationCatalog categories={integrationCategories} />
      <section className="case-section">
        <div className="case-label">Attribution</div>
        <div>
          <h2>Capability and career evidence stay distinct.</h2>
          <p>Specific employer deployments, customer environments, vendor implementations, and professional outcomes remain on Jacob&apos;s Team profile. This page owns the WizardGang-facing capability model; Team owns the career record that supports it.</p>
          <a className="text-link" href="/about/team/jacob/#work-integrations">See supporting professional experience <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section className="case-section">
        <div className="case-label">Software projects</div>
        <div>
          <h2>Project evidence stays with the project.</h2>
          <p>WizardGang-owned projects keep their detailed technical evidence on their canonical project surfaces instead of duplicating it into this catalog.</p>
          <a className="text-link" href={PROJECTS_ROOT_PATH}>Explore projects <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
  )
};

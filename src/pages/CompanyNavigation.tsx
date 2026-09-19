import type { ReactPageDefinition } from "../app/contracts";
import { CapabilityList } from "../components/ProfessionalSurfaces";
import { integrationGroups } from "../data/professional-systems";
import { PROJECTS_ROOT_PATH } from "../data/projects";

const integrationCapabilityAreas = integrationGroups.map((group) => group.title);

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
          <p>Explore the current integration capability areas and the professional experience that supports them without presenting prior employer work as WizardGang client history.</p>
          <a className="text-link" href="/software/integrations/">Explore integrations <span aria-hidden="true">→</span></a>
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
    description: "WizardGang integration capability across enterprise systems, commerce and fulfillment, warehouse automation, carriers, EDI, workflow platforms, and related software boundaries.",
    path: "/software/integrations/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="case-main" id="main" tabIndex={-1}>
      <a className="crumb" href="/software/">← Software</a>
      <section className="page-hero">
        <p className="kicker">Software / Integrations</p>
        <h1>Connect systems.<br /><span>Keep ownership clear.</span></h1>
        <p>WizardGang integration capability is grounded in practical experience connecting applications, data, platforms, and operational workflows. Prior employer and customer work remains attributed to Jacob&apos;s professional record rather than presented as WizardGang client delivery.</p>
      </section>
      <section className="case-section">
        <div className="case-label">Capability areas</div>
        <div>
          <h2>Experience-backed integration areas.</h2>
          <p>The current experience-backed integration record supplies these capability areas without duplicating platform-by-platform career evidence.</p>
          <CapabilityList items={integrationCapabilityAreas} />
        </div>
      </section>
      <section className="case-section">
        <div className="case-label">Attribution</div>
        <div>
          <h2>Capability and career evidence stay distinct.</h2>
          <p>Specific employer deployments, customer environments, and professional integration records remain on Jacob&apos;s Team page. This Software route describes company-facing capability without reassigning ownership of that work.</p>
          <a className="text-link" href="/about/team/jacob/#work-integrations">See supporting professional experience <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section className="case-section">
        <div className="case-label">Software projects</div>
        <div>
          <h2>See the capability in context.</h2>
          <p>WizardGang projects remain the clearest direct evidence of software the organization builds and maintains.</p>
          <a className="text-link" href={PROJECTS_ROOT_PATH}>Explore projects <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
  )
};

export const SOLUTIONS_PAGE: ReactPageDefinition = {
  relative: "solutions/index.html",
  metadata: {
    title: "Solutions — WizardGang",
    description: "Reusable WizardGang approaches for delivering software, including owner-controlled websites and the architecture demo framework.",
    path: "/solutions/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="case-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <p className="kicker">Solutions</p>
        <h1>Reusable approaches<br /><span>for software delivery.</span></h1>
        <p>WizardGang solutions organize repeatable delivery approaches without duplicating the software catalog.</p>
      </section>
      <section className="case-section">
        <div className="case-label">Website services</div>
        <div>
          <h2>Owner-controlled websites.</h2>
          <p>The current fixed-scope website offering remains available under Services.</p>
          <a className="text-link" href="/services/">View services <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section className="case-section">
        <div className="case-label">Demo framework</div>
        <div>
          <h2>Architecture you can inspect.</h2>
          <p>The WizardGang Architecture Demo remains the detailed executable and evidence surface for the reusable demo framework.</p>
          <a className="text-link" href="https://demo.wizardgang.ai">Open architecture demo <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </main>
  )
};

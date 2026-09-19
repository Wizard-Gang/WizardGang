import type { ReactPageDefinition } from "../app/contracts";

export const SOFTWARE_PAGE: ReactPageDefinition = {
  relative: "software/index.html",
  metadata: {
    title: "Software — WizardGang",
    description: "WizardGang software, systems, and integration work, with links to current published projects and professional systems evidence.",
    path: "/software/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="case-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <p className="kicker">Software</p>
        <h1>Software, systems,<br /><span>and integrations.</span></h1>
        <p>WizardGang builds software and connects systems. Current project and professional-system evidence remains available through the existing published sections.</p>
      </section>
      <section className="case-section">
        <div className="case-label">Projects</div>
        <div>
          <h2>Current software projects.</h2>
          <p>SharkTank, Hexframe, and YarReader remain available in the current project catalog.</p>
          <a className="text-link" href="/projects/">View current projects <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section className="case-section">
        <div className="case-label">Systems</div>
        <div>
          <h2>Integration experience.</h2>
          <p>Professional systems and integration experience remains attributed in Jacob's Team record.</p>
          <a className="text-link" href="/about/team/jacob/">View professional work <span aria-hidden="true">→</span></a>
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

import type { ReactPageDefinition } from "../app/contracts";
import { RoleTimeline, SkillList } from "../components/ProfessionalSurfaces";
import { JACOB_TEAM_MEMBER } from "../data/team";
import { professionalRoles, professionalSkills } from "../data/professional";
import { deployments } from "../data/professional-systems";
import { solutionAnchor } from "../data/solutions-menu";

export const ABOUT_PAGE: ReactPageDefinition = {
  relative: "about/index.html",
  metadata: {
    title: "About — WizardGang",
    description: "Software you can read, run, and keep. Built by a solutions architect who has spent seven years inside warehouses, courts and fulfillment centers, where broken software costs someone their shift.",
    path: "/about/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <h1>About</h1>
        <p>Software you can read, run, and keep.</p>
      </section>

      <section className="case-section">
        <div className="case-label">The pitch</div>
        <div>
          <p>
            Most custom software arrives as a black box. You get a demo, an invoice, and a codebase
            nobody outside the project can read. When the contractor leaves, the only person who
            understood it leaves too, and the next change costs more than the original build.
          </p>
          <p>
            WizardGang works the other way around. Every project ships with its source, a running
            demo, and a written account of how it is put together &mdash; not as a courtesy, but so
            you can check the work before you pay for it and keep the work after it is done.
          </p>
          <p>
            That comes from seven years building systems people use to do their jobs: warehouse and
            fulfillment floors, court case management, carrier and ERP integrations across{" "}
            <a href={solutionAnchor("deployments")}>{deployments.length} organizations</a>. When software
            breaks there, someone loses a shift, a shipment, or a filing deadline. Those systems have
            to survive the handoff. So does yours.
          </p>
        </div>
      </section>

      <section className="case-section" id="jacob" aria-labelledby="jacob-heading">
        <div className="case-label">Who</div>
        <div>
          <h2 id="jacob-heading">{JACOB_TEAM_MEMBER.name}</h2>
          <p className="work-entry-lede">{JACOB_TEAM_MEMBER.role}</p>
          <p>
            I am most useful when a problem crosses boundaries &mdash; code and workflow, product and
            operations, technical design and project delivery. My work spans requirements,
            architecture, application development, integrations, QA, deployment, training,
            operational handoff, and production support.
          </p>
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">Background</div>
        <div><RoleTimeline roles={professionalRoles} /></div>
      </section>

      <section className="case-section">
        <div className="case-label">Skills</div>
        <div>
          <div className="skill-groups">
            {professionalSkills.map((group) => <SkillList key={group.label} group={group} />)}
          </div>
        </div>
      </section>
    </main>
  )
};

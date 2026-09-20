import type { ReactPageDefinition } from "../app/contracts";
import { ProfessionalRoleGrid, SkillList } from "../components/ProfessionalSurfaces";
import { CONTACT_EMAIL } from "../data/site";
import { JACOB_TEAM_MEMBER } from "../data/team";
import { professionalRoles, professionalSkills } from "../data/professional";

export const ABOUT_PAGE: ReactPageDefinition = {
  relative: "about/index.html",
  metadata: {
    title: "About — WizardGang",
    description: "WizardGang is Jacob Yongue's software practice: what it builds, how it works, and the professional background behind it.",
    path: "/about/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <h1>About</h1>
        <p>WizardGang is a one-person software practice. It builds its own products and takes on client work where the same standards apply.</p>
      </section>

      <section className="case-section">
        <div className="case-label">How it works</div>
        <div>
          <p>
            Every project ships with its source, a running demo where one makes sense, and a written
            record of how it is put together. That is the whole pitch: you can check the work rather
            than take it on trust.
          </p>
          <p>
            Accessibility, security and operating controls are built in from the start rather than
            added when someone asks. Where a standard is referenced, it means <strong>aligned, not
            certified</strong>.
          </p>
        </div>
      </section>

      <section className="case-section" id="jacob" aria-labelledby="jacob-heading">
        <div className="case-label">Who</div>
        <div>
          <h2 id="jacob-heading">{JACOB_TEAM_MEMBER.name}</h2>
          <p className="work-entry-lede">{JACOB_TEAM_MEMBER.role}</p>
          <p>
            I am a software engineer with an implementation background and a systems view of
            delivery. My work spans requirements, architecture, application development,
            integrations, QA, deployment, training, operational handoff and production support.
          </p>
          <p>
            I am most useful when a problem crosses boundaries: code and workflow, product and
            operations, technical design and project delivery.
          </p>
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">Background</div>
        <div>
          <ProfessionalRoleGrid roles={professionalRoles} className="experience-grid" />
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">Skills</div>
        <div>
          <div className="skill-groups">
            {professionalSkills.map((group) => <SkillList key={group.label} group={group} />)}
          </div>
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">Attribution</div>
        <div>
          <p>
            The roles above are employment history. That experience supports what WizardGang can do,
            but employer and customer work is not WizardGang client work and is not presented as
            such.
          </p>
        </div>
      </section>

      <section className="home-outro" aria-labelledby="about-contact-heading">
        <h2 className="section-label" id="about-contact-heading">Get in touch</h2>
        <a className="outro-mail" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL} <span aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  )
};

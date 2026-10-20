import type { ReactPageDefinition } from "../app/contracts";
import { CONTACT_EMAIL } from "../data/site";

const services = [
  {
    title: "Custom software",
    description: "Focused applications and internal tools that fit how your team actually works."
  },
  {
    title: "System integrations",
    description: "Connect ERP, warehouse, carrier, and business systems without repeated data entry."
  },
  {
    title: "Data & reporting",
    description: "Turn SQL data and operational records into clear reports people can use."
  },
  {
    title: "Workflow automation",
    description: "Reduce manual handoffs with reliable automation and tested processes."
  }
] as const;

const experience = [
  {
    title: "Warehouse & fulfillment",
    description: "WMS/WCS operations, inventory controls, conveyor routing, and shipping integrations."
  },
  {
    title: "Enterprise integrations",
    description: "ERP, EDI, REST APIs, SQL Server, and reporting across connected systems."
  },
  {
    title: "Public-sector applications",
    description: "Case management, reporting, migrations, and production support for regulated workflows."
  }
] as const;

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "WizardGang — Custom software and integrations",
    description: "Custom software, system integrations, reporting and automation for businesses with complex operations. Built with clear ownership and a practical handoff.",
    path: "/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="home-hero" aria-labelledby="home-title">
        <h1 id="home-title">Software that works with your business.</h1>
        <p className="home-lede">
          Custom applications, integrations, reporting, and automation built around the
          systems your team already relies on.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href={`mailto:${CONTACT_EMAIL}`}>
            Discuss a project <span aria-hidden="true">↗</span>
          </a>
          <a className="button" href="#services">
            See services <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="work" id="services" aria-labelledby="services-heading">
        <div className="section-head">
          <h2 className="section-label" id="services-heading">Services</h2>
          <p className="section-blurb">Practical engineering for the work your team does every day.</p>
        </div>
        <ul className="home-topic-grid home-topic-grid-services">
          {services.map(({ title, description }) => (
            <li className="home-topic" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="work" id="experience" aria-labelledby="experience-heading">
        <div className="section-head">
          <h2 className="section-label" id="experience-heading">Experience</h2>
          <p className="section-blurb">Enterprise systems where reliability matters.</p>
        </div>
        <ul className="home-experience-list">
          {experience.map(({ title, description }) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
        <p className="home-experience-note" role="note">
          This experience comes from prior professional roles, not WizardGang client engagements.
        </p>
      </section>

      <section className="work" id="about" aria-labelledby="about-heading">
        <div className="section-head">
          <h2 className="section-label" id="about-heading">About</h2>
          <p className="section-blurb">Small practice. Clear ownership.</p>
        </div>
        <p className="home-about-copy">
          WizardGang builds software for real operating needs. We focus on understanding the
          workflow, connecting the right systems, testing what matters, and making the result
          straightforward to maintain.
        </p>
      </section>

      <section className="home-outro" id="contact" aria-labelledby="contact-heading">
        <h2 className="section-label" id="contact-heading">Tell us what you're building.</h2>
        <p className="section-blurb">A short email is enough to get started.</p>
        <div className="outro-actions">
          <a className="button button-primary" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  )
};

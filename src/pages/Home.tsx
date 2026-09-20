import type { ReactPageDefinition } from "../app/contracts";
import { WorkRow } from "../components/ProjectSurfaces";
import { projects } from "../data/projects";
import { CONTACT_EMAIL } from "../data/site";

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "WizardGang — Inspectable software",
    description: "WizardGang is Jacob Yongue's software practice. Three products, each shipping with its source, a live demo, and the engineering record behind it.",
    path: "/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="home-hero">
        <h1>We build inspectable software.</h1>
        <p className="home-lede">
          WizardGang is Jacob Yongue&apos;s software practice. Every project below ships with its
          source, a live demo, and the engineering record behind it.
        </p>
      </section>

      <section className="work" aria-labelledby="home-work-heading">
        <h2 className="section-label" id="home-work-heading">Selected work</h2>
        {projects.map((project) => <WorkRow key={project.id} project={project} />)}
      </section>

      <section className="home-outro" aria-labelledby="home-contact-heading">
        <h2 className="section-label" id="home-contact-heading">Work with WizardGang</h2>
        <a className="outro-mail" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL} <span aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  )
};

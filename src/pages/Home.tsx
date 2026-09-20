import type { ReactPageDefinition } from "../app/contracts";
import { WorkRow } from "../components/ProjectSurfaces";
import { projects } from "../data/projects";

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "WizardGang — Software that ships",
    description: "SharkTank, Hexframe and YarReader: three products from WizardGang, each with its source, a live demo, and the engineering record behind it.",
    path: "/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="home-hero">
        <h1>We build software that ships</h1>
      </section>

      <section className="work" aria-labelledby="home-work-heading">
        <h2 className="section-label" id="home-work-heading">Selected work</h2>
        {projects.map((project) => <WorkRow key={project.id} project={project} />)}
      </section>

    </main>
  )
};

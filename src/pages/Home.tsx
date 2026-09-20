import type { ReactPageDefinition } from "../app/contracts";
import { DisclosureRow } from "../components/Disclosure";
import { WorkRow } from "../components/ProjectSurfaces";
import { projects } from "../data/projects";
import { DEMO_FRAMEWORK_URL } from "../data/site";
import { solutionAnchor } from "../data/solutions-menu";
import {
  professionalIntegrationEvidence,
  professionalSystemEvidence
} from "../data/professional-systems";

const pad = (index: number) => String(index + 1).padStart(2, "0");

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "WizardGang — Software that ships",
    description: "Industries delivered into, systems integrated in production, and the projects WizardGang builds and operates in the open.",
    path: "/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="home-hero">
        <h1>Software that Ships</h1>
      </section>

      <section className="work" aria-labelledby="home-industries-heading">
        <h2 className="section-label" id="home-industries-heading">
          Selected industries
          <a href={solutionAnchor("industries")}>All industries <span aria-hidden="true">→</span></a>
        </h2>
        {professionalSystemEvidence.map((group, index) => (
          <DisclosureRow
            key={group.title}
            group="home-industries"
            index={pad(index)}
            title={group.title}
            tagline={`${group.items.length} capabilities`}
          >
            <ul className="evidence-list evidence-inline" aria-label={group.title}>
              {group.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </DisclosureRow>
        ))}
      </section>

      <section className="work" aria-labelledby="home-integrations-heading">
        <h2 className="section-label" id="home-integrations-heading">
          Selected integrations
          <a href={solutionAnchor("integrations")}>All integrations <span aria-hidden="true">→</span></a>
        </h2>
        {professionalIntegrationEvidence.map((group, index) => (
          <DisclosureRow
            key={group.title}
            group="home-integrations"
            index={pad(index)}
            title={group.title}
            tagline={`${group.items.length} systems`}
          >
            <ul className="evidence-list evidence-inline evidence-links" aria-label={group.title}>
              {group.items.map((item) => (
                <li key={item.name}>
                  {item.url ? <a href={item.url}>{item.name} <span aria-hidden="true">↗</span></a> : item.name}
                </li>
              ))}
            </ul>
          </DisclosureRow>
        ))}
      </section>

      <section className="work" aria-labelledby="home-projects-heading">
        <h2 className="section-label" id="home-projects-heading">Selected projects</h2>
        {projects.map((project) => <WorkRow key={project.id} project={project} />)}
      </section>

      <section className="home-outro" aria-labelledby="home-architecture-heading">
        <h2 className="section-label" id="home-architecture-heading">Go deeper</h2>
        <a className="outro-mail" href={DEMO_FRAMEWORK_URL}>
          Explore the Architecture <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  )
};

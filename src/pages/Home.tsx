import type { ReactPageDefinition } from "../app/contracts";
import { WorkRow } from "../components/ProjectSurfaces";
import { projects } from "../data/projects";
import { DEMO_FRAMEWORK_URL } from "../data/site";
import { solutionAnchor } from "../data/solutions-menu";
import {
  professionalIntegrationEvidence,
  professionalSystemEvidence
} from "../data/professional-systems";

/* Industries and integrations are short enough to read at a glance, so each is
   one section-level disclosure rather than a row per group. Projects stay a row
   each, because each row carries a preview worth opening on its own. */

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "WizardGang — Software that ships",
    description: "Software you can read, run, and keep. Industries delivered into, systems integrated in production, and projects built and operated in the open.",
    path: "/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="home-hero">
        <h1>Software that Ships</h1>
        <p className="home-lede">
          Most custom software arrives as a black box. Every project here ships with its source, a
          running demo, and the record of how it is put together &mdash; so you can check the work
          before you pay for it, and keep it after it is done.
        </p>
      </section>

      <section className="work" aria-labelledby="home-industries-heading">
        <h2 className="section-label" id="home-industries-heading">
          Selected industries
          <a href={solutionAnchor("industries")}>All industries <span aria-hidden="true">→</span></a>
        </h2>
        <p className="section-blurb">Operational domains I have shipped into.</p>
        <details className="section-panel">
          <summary>
            <span>{professionalSystemEvidence.length} domains</span>
            <span className="work-disclose" aria-hidden="true">
              <svg viewBox="0 0 16 16" focusable="false"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </summary>
          <div className="evidence-groups">
            {professionalSystemEvidence.map((group) => (
              <section className="evidence-group" key={group.title}>
                <h3>{group.title}</h3>
                <ul className="evidence-list" aria-label={group.title}>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            ))}
          </div>
        </details>
      </section>

      <section className="work" aria-labelledby="home-integrations-heading">
        <h2 className="section-label" id="home-integrations-heading">
          Selected integrations
          <a href={solutionAnchor("integrations")}>All integrations <span aria-hidden="true">→</span></a>
        </h2>
        <p className="section-blurb">Systems I have connected in production.</p>
        <details className="section-panel">
          <summary>
            <span>{professionalIntegrationEvidence.length} groups</span>
            <span className="work-disclose" aria-hidden="true">
              <svg viewBox="0 0 16 16" focusable="false"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </summary>
          <div className="evidence-groups">
            {professionalIntegrationEvidence.map((group) => (
              <section className="evidence-group" key={group.title}>
                <h3>{group.title}</h3>
                <ul className="evidence-list evidence-vendors" aria-label={group.title}>
                  {group.items.map((item) => (
                    <li key={item.name}>
                      {item.url ? (
                        <a href={item.url}>
                          {item.logo ? <img className="vendor-mark" src={item.logo} alt="" width={20} height={20} loading="lazy" /> : <span className="vendor-mark vendor-mark-text" aria-hidden="true">{item.name.slice(0, 1)}</span>}
                          {item.name} <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <span><span className="vendor-mark vendor-mark-text" aria-hidden="true">{item.name.slice(0, 1)}</span>{item.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </details>
      </section>

      <section className="work" aria-labelledby="home-projects-heading">
        <h2 className="section-label" id="home-projects-heading">Selected projects</h2>
        <p className="section-blurb">Software WizardGang builds and operates in the open.</p>
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

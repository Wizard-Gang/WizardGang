import type { ReactPageDefinition } from "../app/contracts";
import { ProjectActions, ProjectArchitecture, ProjectVisualFrame } from "../components/ProjectSurfaces";
import { WORK_PATH, projects, type ProjectRecord } from "../data/projects";

/* One entry per project. The overview and the case study used to be separate
   routes that repeated each other's facts; a project is one thing, so it reads
   as one thing. */
function WorkEntry({ project }: { project: ProjectRecord }) {
  const headingId = `${project.slug}-heading`;
  return (
    <article className="work-entry" id={project.slug} aria-labelledby={headingId}>
      <header className="work-entry-head">
        <p className="work-index"><span className="work-number">{project.number}</span><span>{project.eyebrow}</span></p>
        <h2 id={headingId}>{project.name}</h2>
        <p className="work-entry-lede">{project.narrative.tagline}</p>
      </header>

      <ProjectVisualFrame project={project} />

      <dl className="work-facts">
        <div>
          <dt>Primary capability</dt>
          <dd>{project.primaryCapability}</dd>
        </div>
        <div>
          <dt>{project.technologies?.length ? "Technologies" : "Characteristics"}</dt>
          <dd>
            <ul className="work-tags">
              {(project.technologies?.length ? project.technologies : project.characteristics).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <section className="case-section">
        <div className="case-label">Problem</div>
        <div><p>{project.problem}</p></div>
      </section>

      <section className="case-section">
        <div className="case-label">Built</div>
        <div>
          <ul className="built-list">
            {project.built.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">Architecture</div>
        <div><ProjectArchitecture items={project.architecture} /></div>
      </section>

      <section className="case-section">
        <div className="case-label">Approach</div>
        <div><p>{project.engineering}</p></div>
      </section>

      <section className="case-section">
        <div className="case-label">Result</div>
        <div>
          <p>{project.result}</p>
          <ProjectActions project={project} surface="detail" />
        </div>
      </section>
    </article>
  );
}

export const WORK_PAGE: ReactPageDefinition = {
  relative: "work/index.html",
  metadata: {
    title: "Work — WizardGang",
    description: "SharkTank, Hexframe, and YarReader: what each project had to solve, what was built, how it is put together, and where the source and live demo are.",
    path: WORK_PATH,
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <h1>Work</h1>
        <p>Three projects, each with its source, its architecture, and a demo you can open.</p>
      </section>

      <nav className="work-jump" aria-label="Projects on this page">
        <ul>
          {projects.map((project) => (
            <li key={project.slug}><a href={`#${project.slug}`}>{project.name}</a></li>
          ))}
        </ul>
      </nav>

      {projects.map((project) => <WorkEntry key={project.id} project={project} />)}
    </main>
  )
};

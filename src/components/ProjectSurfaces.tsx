import {
  projectActionsFor,
  projectPath,
  type ProjectArchitectureItem,
  type ProjectRecord
} from "../data/projects";
import { ProjectPreview } from "./ProjectPreviews";

function Arrow({ external }: { external: boolean }) {
  return <span aria-hidden="true">{external ? "↗" : "→"}</span>;
}

export function ProjectActions({ project, surface }: { project: ProjectRecord; surface: "card" | "overview" | "case-study" }) {
  const actions = projectActionsFor(project, surface);
  const compact = surface === "card";
  return (
    <div className={compact ? "project-card-actions" : "button-row"}>
      {actions.map((action) => (
        <a
          className={compact ? "text-link" : `button${action.primary ? " button-primary" : ""}`}
          data-project-action={action.id}
          data-primary={action.primary ? "true" : undefined}
          href={action.href}
          aria-label={action.ariaLabel}
          key={action.id}
        >
          {action.label} <Arrow external={action.external} />
        </a>
      ))}
    </div>
  );
}

function LabelList({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="project-fact">
      <dt>{label}</dt>
      <dd><ul className="tags" aria-label={label}>{items.map((item) => <li key={item}>{item}</li>)}</ul></dd>
    </div>
  );
}

export function ProjectDetails({ project }: { project: ProjectRecord }) {
  return (
    <dl className="project-facts">
      <div className="project-fact project-fact-primary">
        <dt>Primary capability</dt>
        <dd>{project.primaryCapability}</dd>
      </div>
      {project.technologies?.length ? <LabelList label="Technologies" items={project.technologies} /> : null}
      <LabelList label="Characteristics" items={project.characteristics} />
    </dl>
  );
}

export function ProjectCard({ project, headingLevel = 3 }: { project: ProjectRecord; headingLevel?: 2 | 3 }) {
  const highlights = project.technologies?.length ? project.technologies.slice(0, 2) : project.characteristics.slice(0, 2);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className={`project-card${project.preview ? "" : " project-card-no-preview"}`}>
      {project.preview ? (
        <div
          className="project-card-visual"
          aria-hidden="true"
          inert
          data-preview-id={project.preview.id}
          data-preview-kind={project.preview.kind}
          data-preview-fixture={project.preview.fixture}
        >
          <ProjectPreview project={project} />
        </div>
      ) : null}
      <div className="project-card-copy">
        <span className="project-number">{project.number} / {project.eyebrow}</span>
        <Heading><a href={projectPath(project.slug)}>{project.name}</a></Heading>
        <p className="project-card-capability"><span>Primary capability</span>{project.primaryCapability}</p>
        <p>{project.summary}</p>
        {highlights.length ? <ul className="tags" aria-label={project.technologies?.length ? "Selected technologies" : "Selected characteristics"}>{highlights.map((item) => <li key={item}>{item}</li>)}</ul> : null}
        <ProjectActions project={project} surface="card" />
      </div>
    </article>
  );
}

export function ProjectCardGrid({ projects, headingLevel = 3 }: { projects: readonly ProjectRecord[]; headingLevel?: 2 | 3 }) {
  return <div className="project-card-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} headingLevel={headingLevel} />)}</div>;
}

export function ProjectOverviewHeader({ project }: { project: ProjectRecord }) {
  return (
    <>
      <a className="crumb" href="/software/projects/">← Projects</a>
      <section className="showcase-hero">
        <p className="kicker">{project.number} / {project.eyebrow}</p>
        <h1>{project.name}</h1>
        <p>{project.narrative.tagline}</p>
        <p className="project-primary-capability"><span>Primary capability</span>{project.primaryCapability}</p>
        <ProjectActions project={project} surface="overview" />
      </section>
    </>
  );
}

export function ProjectCaseStudyHeader({ project }: { project: ProjectRecord }) {
  return (
    <>
      <a className="crumb" href={projectPath(project.slug)}>← {project.name} overview</a>
      <section className="case-hero">
        <div><p className="kicker">{project.number} / {project.eyebrow}</p><h1>{project.name}</h1></div>
        <div>
          <p className="case-lede">{project.summary}</p>
          <ProjectDetails project={project} />
          <ProjectActions project={project} surface="case-study" />
        </div>
      </section>
    </>
  );
}

export function ProjectArchitecture({ items }: { items: readonly ProjectArchitectureItem[] }) {
  return (
    <div className="architecture">
      {items.map(([name, detail]) => <div key={name}><strong>{name}</strong><span>{detail}</span></div>)}
    </div>
  );
}

export function ProjectVisualFrame({ project, showcase = false }: { project: ProjectRecord; showcase?: boolean }) {
  if (!project.preview) return null;
  return (
    <div
      className={showcase ? "case-visual showcase-visual" : "case-visual"}
      aria-hidden="true"
      inert
      data-preview-id={project.preview.id}
      data-preview-kind={project.preview.kind}
      data-preview-fixture={project.preview.fixture}
    >
      <ProjectPreview project={project} />
    </div>
  );
}

/* The work-first homepage row. The preview is the argument, so it gets the full
   shell width; the caption carries only what a visitor needs to decide whether
   to open the project. */
export function WorkRow({ project }: { project: ProjectRecord }) {
  const tags = (project.technologies?.length ? project.technologies : project.characteristics).slice(0, 3);
  const action = projectActionsFor(project, "card").find((candidate) => candidate.id === "project");
  return (
    <article className="work-row">
      {project.preview ? (
        <div
          className="work-visual"
          aria-hidden="true"
          inert
          data-preview-id={project.preview.id}
          data-preview-kind={project.preview.kind}
          data-preview-fixture={project.preview.fixture}
        >
          <ProjectPreview project={project} />
        </div>
      ) : null}
      <div className="work-caption">
        <div className="work-identity">
          <p className="work-index"><span className="work-number">{project.number}</span><span>{project.eyebrow}</span></p>
          <h3><a href={projectPath(project.slug)}>{project.name}</a></h3>
        </div>
        <div className="work-detail">
          <p className="work-tagline">{project.narrative.tagline}</p>
          <ul className="work-tags" aria-label={project.technologies?.length ? "Selected technologies" : "Selected characteristics"}>
            {tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          {action ? (
            <a className="work-link" href={action.href} aria-label={action.ariaLabel} data-project-action={action.id}>
              {action.label} <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

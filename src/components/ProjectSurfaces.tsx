import {
  projectActionsFor,
  projectPath,
  type ProjectActionSurface,
  type ProjectArchitectureItem,
  type ProjectRecord
} from "../data/projects";
import { ProjectPreview } from "./ProjectPreviews";

function Arrow({ external }: { external: boolean }) {
  return <span aria-hidden="true">{external ? "↗" : "→"}</span>;
}

export function ProjectActions({ project, surface }: { project: ProjectRecord; surface: ProjectActionSurface }) {
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

export function ProjectArchitecture({ items }: { items: readonly ProjectArchitectureItem[] }) {
  return (
    <div className="architecture">
      {items.map(([name, detail]) => <div key={name}><strong>{name}</strong><span>{detail}</span></div>)}
    </div>
  );
}

export function ProjectVisualFrame({ project }: { project: ProjectRecord }) {
  if (!project.preview) return null;
  return (
    <div
      className="case-visual"
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

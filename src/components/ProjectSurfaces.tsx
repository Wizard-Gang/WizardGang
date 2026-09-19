import { projectCaseStudyPath, projectPath, type ProjectRecord } from "../data/projects";
import { ProjectPreview } from "./ProjectPreviews";

export type ProjectActionVariant = "card" | "overview" | "case";

function Arrow({ external }: { external: boolean }) {
  return <span aria-hidden="true">{external ? "↗" : "→"}</span>;
}

export function ProjectActions({
  project,
  variant
}: {
  project: ProjectRecord;
  variant: ProjectActionVariant;
}) {
  if (variant === "card") {
    return (
      <div className="project-card-actions">
        {project.liveUrl ? <a className="text-link" href={project.liveUrl} aria-label={`Play ${project.name}`}>Play <Arrow external /></a> : null}
        <a className="text-link" href={projectCaseStudyPath(project.slug)} aria-label={`Read the ${project.name} case study`}>Case study <Arrow external={false} /></a>
        <a className="text-link" href={project.sourceUrl} aria-label={`View ${project.name} source code on GitHub`}>GitHub <Arrow external /></a>
      </div>
    );
  }

  if (variant === "overview") {
    return (
      <div className="button-row">
        {project.liveUrl ? <a className="button button-primary" href={project.liveUrl} aria-label={`Play ${project.name}`}>Play <Arrow external /></a> : null}
        <a className={project.liveUrl ? "button" : "button button-primary"} href={projectCaseStudyPath(project.slug)} aria-label={`Read the ${project.name} case study`}>Case study <Arrow external={false} /></a>
        <a className="button" href={project.sourceUrl} aria-label={`View ${project.name} source code on GitHub`}>GitHub <Arrow external /></a>
      </div>
    );
  }

  return (
    <div className="button-row">
      {project.liveUrl ? <a className="button button-primary" href={project.liveUrl} aria-label={`Play ${project.name}`}>Play <Arrow external /></a> : null}
      {project.operationsUrl ? <a className="button" href={project.operationsUrl} aria-label={`View ${project.name} operating evidence`}>Evidence <Arrow external /></a> : null}
      <a className="button" href={project.sourceUrl} aria-label={`View ${project.name} source code on GitHub`}>GitHub <Arrow external /></a>
    </div>
  );
}

export function ProjectTags({ project }: { project: ProjectRecord }) {
  return <ul className="tags" aria-label="Technologies">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>;
}

export function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <article className="project-card">
      <div className="project-card-visual" aria-hidden="true" inert>
        <ProjectPreview project={project} />
      </div>
      <div className="project-card-copy">
        <span className="project-number">{project.number} / {project.eyebrow}</span>
        <h3><a href={projectPath(project.slug)}>{project.name}</a></h3>
        <p>{project.description}</p>
        <ProjectActions project={project} variant="card" />
      </div>
    </article>
  );
}

export function ProjectCardGrid({ projects }: { projects: readonly ProjectRecord[] }) {
  return <div className="project-card-grid">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>;
}

export function ProjectVisualFrame({
  project,
  showcase = false
}: {
  project: ProjectRecord;
  showcase?: boolean;
}) {
  return (
    <div className={showcase ? "case-visual showcase-visual" : "case-visual"} aria-hidden="true" inert>
      <ProjectPreview project={project} />
    </div>
  );
}

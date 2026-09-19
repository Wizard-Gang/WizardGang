import type { ReactPageDefinition } from "../app/contracts";
import { ProjectActions, ProjectCardGrid, ProjectTags, ProjectVisualFrame } from "../components/ProjectSurfaces";
import {
  PROJECTS_INDEX_METADATA,
  projectBySlug,
  projects,
  type ProjectArchitectureItem,
  type ProjectRecord
} from "../data/projects";

function Architecture({ items }: { items: readonly ProjectArchitectureItem[] }) {
  return (
    <div className="architecture">
      {items.map(([name, detail]) => <div key={name}><strong>{name}</strong><span>{detail}</span></div>)}
    </div>
  );
}

function BuiltList({ items }: { items: readonly string[] }) {
  return <ul className="built-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function SelectedProjectsSection() {
  return (
    <section className="portfolio-section selected-projects" aria-labelledby="selected-projects-heading">
      <div className="section-heading">
        <div><p className="kicker">Selected projects</p><h2 id="selected-projects-heading">Independent systems, shipped.</h2></div>
        <a className="text-link" href="/projects/">All projects <span aria-hidden="true">→</span></a>
      </div>
      <ProjectCardGrid projects={projects} />
    </section>
  );
}

function ProjectsIndexPage() {
  return (
    <main className="case-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <p className="kicker">Projects</p>
        <h1>Built to be<br /><span>inspected.</span></h1>
        <p>Independent software projects with a clear path from concise overview to technical case study, running application, and source evidence.</p>
      </section>
      <section className="projects-index" aria-label="Personal engineering projects">
        <ProjectCardGrid projects={projects} />
      </section>
    </main>
  );
}

function ProjectOverviewPage({ project }: { project: ProjectRecord }) {
  const copy = project.narrative;
  return (
    <main className="case-main showcase-main" id="main" tabIndex={-1}>
      <a className="crumb" href="/projects/">← Projects</a>
      <section className="showcase-hero">
        <p className="kicker">{project.number} / {project.eyebrow}</p>
        <h1>{project.name}</h1>
        <p>{copy.tagline}</p>
        <ProjectActions project={project} variant="overview" />
      </section>
      <ProjectVisualFrame project={project} showcase />
      <section className="showcase-overview">
        <article><p className="kicker">What it is</p><h2>A complete working system.</h2><p>{copy.what}</p></article>
        <article><p className="kicker">Why I built it</p><h2>The engineering question.</h2><p>{copy.why}</p></article>
      </section>
      <section className="case-section">
        <div className="case-label">Engineering highlights</div>
        <div><h2>What the project demonstrates.</h2><BuiltList items={copy.highlights} /></div>
      </section>
      <section className="project-depth">
        <div><p className="kicker">Go deeper</p><h2>Overview first. Evidence when you want it.</h2></div>
        <div>
          <p>The case study explains the architecture, boundaries, tradeoffs, and current state. The running application and repository provide the proof.</p>
          <ProjectActions project={project} variant="overview" />
        </div>
      </section>
    </main>
  );
}

const SHARKTANK_OPERATING_CONTROLS = [
  "Public input is checked before the game accepts it",
  "Operator controls are protected and leave a record when they are used",
  "Each release records what changed and how the result was checked",
  "Daily backups are tested by restoring and reading the saved copy",
  "The service reports its current status and calculates uptime from its own records",
  "The service counts billable activity and stops costly actions at a hard limit"
] as const;

const SHARKTANK_AI_CONTROLS = [
  "The application code is 100% AI-generated",
  "Policies describe how AI-produced changes are planned, checked, tested, and released",
  "Security, cost, accessibility, recovery, and evidence requirements apply to AI-produced features",
  "Tests and live records check the result instead of trusting generated code because it looks correct",
  "Jacob owns the service, approves its operation, and remains responsible for its results"
] as const;

const SHARKTANK_ACCESSIBILITY_CONTROLS = [
  "Public pages and supported game controls can be used with a keyboard",
  "Visible focus shows where the user is, while clear headings, labels, and skip links make pages easier to navigate",
  "Screen readers announce status changes and errors without moving the user's place",
  "Text and layouts remain readable with browser zoom and stronger contrast",
  "Options include reduced motion, larger text, color labels, captions, and steering help"
] as const;

function SharkTankCaseStudy({ project }: { project: ProjectRecord }) {
  return (
    <main className="case-main" id="main" tabIndex={-1}>
      <a className="crumb" href="/projects/sharktank/">← SharkTank overview</a>
      <section className="case-hero">
        <div><p className="kicker">{project.number} / {project.eyebrow}</p><h1>{project.name}</h1></div>
        <div><p className="case-lede">{project.description}</p><ProjectTags project={project} /><ProjectActions project={project} variant="case" /></div>
      </section>
      <ProjectVisualFrame project={project} />

      <section className="case-section">
        <div className="case-label">01 — The game</div>
        <div><h2>It starts with multiplayer gameplay.</h2><p>Players control sharks in a shared tank. They eat food, dash forward, fire rockets, and compete for score while the server keeps everyone in the same match. The security and operating features support that game; they are not the game itself.</p></div>
      </section>

      <section className="case-section">
        <div className="case-label">02 — The operating problem</div>
        <div><h2>A live game uses real resources.</h2><p>{project.problem}</p><p>Shark Tank therefore includes the checks needed to run the game responsibly. They protect public input, control operator access, track billable activity, record changes, and provide a recovery path.</p></div>
      </section>

      <section className="case-section">
        <div className="case-label">03 — ISO/IEC 27001</div>
        <div>
          <h2>Secure operation is built into the game.</h2>
          <p><strong>ISO/IEC 27001</strong> provides principles for managing information security. Shark Tank applies those principles to every feature and to the way the live service is operated: access is controlled, input is checked, changes are tested, backups are verified, and important actions leave records. These are everyday safeguards, not a claim that a security incident has occurred.</p>
          <BuiltList items={SHARKTANK_OPERATING_CONTROLS} />
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">04 — ISO/IEC 42001</div>
        <div>
          <h2>The AI story is how the game was developed.</h2>
          <p><strong>ISO/IEC 42001</strong> applies here because the codebase was developed entirely with AI-generated code. It guides how that development is managed: what AI is used for, how its output is checked, who remains responsible, and what evidence is kept.</p>
          <BuiltList items={SHARKTANK_AI_CONTROLS} />
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">05 — Owner-run operations</div>
        <div><h2>Controls help the owner run the service.</h2><p>Jacob operates Shark Tank. If a real incident occurs, he reports it, investigates it, resolves it, and closes the record. Built-in checks and status pages help him see what the service is doing and respond when action is needed.</p></div>
      </section>

      <section className="case-section">
        <div className="case-label">06 — Reliability</div>
        <div><h2>Uptime comes from the service record.</h2><p>The site calculates availability from the records kept since the project started. When those records support it, the page says <strong>100% uptime maintained</strong>. If the record changes, the displayed number changes too.</p></div>
      </section>

      <section className="case-section">
        <div className="case-label">07 — Billable actions</div>
        <div>
          <h2>Gameplay has a spending limit.</h2>
          <p>Joining a tank, running a live room, steering, dashing, and saving records all use metered cloud resources. The service measures that activity while the game runs. At the hard spending limit, it pauses gameplay and other actions that could add cost. Status, evidence, and recovery pages remain available so Jacob can review the situation before restarting normal play.</p>
          <Architecture items={[
            ["Normal", "The game, updates, and public records work normally"],
            ["Measure", "The service counts billable activity as it happens"],
            ["Limit reached", "Gameplay and other costly actions pause"],
            ["Review and restart", "Status and recovery stay available to the owner"]
          ]} />
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">08 — Policies and evidence</div>
        <div>
          <h2>The rules and their results stay together.</h2>
          <p>Shark Tank documents its policies against ISO/IEC 27001 and ISO/IEC 42001. The same service keeps evidence for the controls it operates, including changes, uptime, billable activity, operator actions, backups, and recovery checks. This makes it possible to compare a written policy with what the game actually did.</p>
          <Architecture items={[
            ["Policy", "State the rule and the ISO requirement it supports"],
            ["Game control", "Build the rule into the service or its operating process"],
            ["Check", "Test that the control behaves as intended"],
            ["Evidence", "Keep the live result or operating record"]
          ]} />
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">09 — Accessibility</div>
        <div>
          <h2>More people can use the site and its controls.</h2>
          <p><strong>WCAG 2.0 AA</strong> is a common set of web-accessibility rules. Shark Tank's public pages, menus, settings, and supported game controls are tested against those rules. This does not mean every visual action in the game has a matching nonvisual version; the claim covers the listed screens and controls.</p>
          <BuiltList items={SHARKTANK_ACCESSIBILITY_CONTROLS} />
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">10 — Architecture</div>
        <div><h2>Each service has one job.</h2><Architecture items={project.architecture} /><p>The browser shows the game and public records. The Worker checks requests and serves those pages. Durable Objects keep live matches, logs, and operator records. R2 stores separate backup copies for recovery tests.</p></div>
      </section>

      <section className="case-section">
        <div className="case-label">11 — Result</div>
        <div><h2>A game first, with its controls built in.</h2><p>{project.result}</p><ProjectActions project={project} variant="case" /></div>
      </section>
    </main>
  );
}

const HEXFRAME_ACCESSIBILITY_CONTROLS = [
  "Keyboard and gamepad controls for the training lab and menus",
  "Clear focus when moving through buttons, tabs, and dialogs",
  "Larger text, stronger contrast, and color-vision settings",
  "Reduced motion and reduced combat flashes",
  "Screen-reader messages for important status and combat changes"
] as const;

function StandardProjectCaseStudy({ project }: { project: ProjectRecord }) {
  const isHexframe = project.slug === "hexframe";
  const problemHeading = isHexframe ? "Make every feature agree on what happened." : "Protect the library while rebuilding it.";
  const engineeringHeading = isHexframe ? "Graphics show the fight; game rules decide it." : "Do the hard work before the reader opens.";
  const resultHeading = isHexframe ? "A playable foundation that can grow." : "A library that can recover and be rebuilt.";
  const resultNumber = isHexframe ? "06" : "05";

  return (
    <main className="case-main" id="main" tabIndex={-1}>
      <a className="crumb" href={`/projects/${project.slug}/`}>← {project.name} overview</a>
      <section className="case-hero">
        <div><p className="kicker">{project.number} / {project.eyebrow}</p><h1>{project.name}</h1></div>
        <div><p className="case-lede">{project.description}</p><ProjectTags project={project} /><ProjectActions project={project} variant="case" /></div>
      </section>
      <ProjectVisualFrame project={project} />

      <section className="case-section">
        <div className="case-label">01 — Problem</div>
        <div><h2>{problemHeading}</h2><p>{project.problem}</p></div>
      </section>

      <section className="case-section">
        <div className="case-label">02 — What I built</div>
        <div><h2>What the project does.</h2><BuiltList items={project.built} /></div>
      </section>

      <section className="case-section">
        <div className="case-label">03 — Architecture</div>
        <div><h2>Each part has one job.</h2><Architecture items={project.architecture} /></div>
      </section>

      <section className="case-section">
        <div className="case-label">04 — Key design choice</div>
        <div><h2>{engineeringHeading}</h2><p>{project.engineering}</p></div>
      </section>

      {isHexframe ? (
        <section className="case-section">
          <div className="case-label">05 — Accessibility</div>
          <div>
            <h2>The lab supports different controls and display needs.</h2>
            <p>Hexframe's menus and training tools target <strong>WCAG 2.0 AA</strong>. The lab works with a keyboard or gamepad, always shows which control has focus, and can announce important combat updates to a screen reader. Players can also change text size, contrast, color labels, and motion.</p>
            <BuiltList items={HEXFRAME_ACCESSIBILITY_CONTROLS} />
            <p>The claim covers these menus, tools, settings, and supported controls. It does not claim a complete nonvisual replacement for the spatial fight itself.</p>
          </div>
        </section>
      ) : null}

      <section className="case-section">
        <div className="case-label">{resultNumber} — What works today</div>
        <div><h2>{resultHeading}</h2><p>{project.result}</p><ProjectActions project={project} variant="case" /></div>
      </section>
    </main>
  );
}

function ProjectCaseStudyPage({ project }: { project: ProjectRecord }) {
  return project.slug === "sharktank"
    ? <SharkTankCaseStudy project={project} />
    : <StandardProjectCaseStudy project={project} />;
}

export function createProjectPageDefinitions(): readonly ReactPageDefinition[] {
  const definitions: ReactPageDefinition[] = [
    {
      relative: "projects/index.html",
      metadata: PROJECTS_INDEX_METADATA,
      body: <ProjectsIndexPage />
    }
  ];

  for (const project of projects) {
    definitions.push(
      {
        relative: `projects/${project.slug}/index.html`,
        metadata: project.overviewMetadata,
        body: <ProjectOverviewPage project={project} />
      },
      {
        relative: `projects/${project.slug}/case-study/index.html`,
        metadata: project.caseStudyMetadata,
        body: <ProjectCaseStudyPage project={project} />
      }
    );
  }

  return definitions;
}

export function getProjectForRoute(slug: string): ProjectRecord | undefined {
  return projectBySlug.get(slug as ProjectRecord["slug"]);
}

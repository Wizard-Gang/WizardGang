import type { PageMetadata } from "../app/contracts";

export type ProjectSlug = "sharktank" | "hexframe" | "yarreader";
export type ProjectId = ProjectSlug;
export type ProjectArchitectureItem = readonly [name: string, detail: string];
export type ProjectPreviewKind = "motion-controlled" | "static";
export type ProjectPreviewFixture = "product-recreation" | "synthetic-demo";

export const PROJECTS_ROOT_PATH = "/software/projects/" as const;

export function projectPath(slug: ProjectSlug): `/software/projects/${ProjectSlug}/` {
  return `/software/projects/${slug}/`;
}

export function projectCaseStudyPath(slug: ProjectSlug): `/software/projects/${ProjectSlug}/case-study/` {
  return `/software/projects/${slug}/case-study/`;
}

export function projectOutputPath(slug: ProjectSlug): `software/projects/${ProjectSlug}/index.html` {
  return `software/projects/${slug}/index.html`;
}

export function projectCaseStudyOutputPath(slug: ProjectSlug): `software/projects/${ProjectSlug}/case-study/index.html` {
  return `software/projects/${slug}/case-study/index.html`;
}

export interface ProjectNarrative {
  tagline: string;
  what: string;
  why: string;
  highlights: readonly string[];
}

export interface ProjectPreviewDefinition {
  id: string;
  kind: ProjectPreviewKind;
  fixture: ProjectPreviewFixture;
}

export interface ProjectCaseStudyDefinition {
  title: string;
}

export type ProjectActionSurface = "card" | "overview" | "case-study";
export type ProjectActionId = "project" | "live" | "case-study" | "evidence" | "source";

export interface ProjectAction {
  id: ProjectActionId;
  label: string;
  ariaLabel: string;
  href: string;
  external: boolean;
  primary: boolean;
}

export interface ProjectRecord {
  id: ProjectId;
  slug: ProjectSlug;
  name: string;
  number: string;
  eyebrow: string;
  summary: string;
  primaryCapability: string;
  technologies?: readonly string[];
  characteristics: readonly string[];
  liveUrl: string | null;
  operationsUrl?: string;
  sourceUrl: string;
  preview: ProjectPreviewDefinition | null;
  caseStudy: ProjectCaseStudyDefinition | null;
  problem: string;
  built: readonly string[];
  architecture: readonly ProjectArchitectureItem[];
  engineering: string;
  result: string;
  narrative: ProjectNarrative;
}

export const projects = [
  {
    id: "sharktank",
    slug: "sharktank",
    name: "SharkTank",
    number: "01",
    eyebrow: "Artificial-intelligence-developed multiplayer game",
    summary: "A live multiplayer shark game built entirely with code created by artificial intelligence (AI), with measured cloud costs, accessible interfaces, and built-in security, reliability, and operating controls.",
    primaryCapability: "Live multiplayer operation and governance",
    technologies: ["Worker", "Durable Objects", "R2"],
    characteristics: ["Multiplayer game", "100% artificial-intelligence-developed", "ISO/IEC 27001 aligned", "ISO/IEC 42001 aligned", "Built-in cost controls"],
    liveUrl: "https://sharktank.wizardgang.ai/play/",
    operationsUrl: "https://sharktank.wizardgang.ai/evidence/",
    sourceUrl: "https://github.com/Wizard-Gang/SharkTank",
    preview: { id: "sharktank-gameplay", kind: "motion-controlled", fixture: "product-recreation" },
    caseStudy: { title: "AI-Developed Multiplayer Game" },
    problem: "Shark Tank is a game first, but running it creates real responsibilities. Multiplayer actions use billable cloud resources, public input must be checked, changes must be tested, and the fully AI-generated code needs a clear management process. Those controls must protect the game without getting in the player's way.",
    built: [
      "A realtime multiplayer game where sharks eat food, dash through the tank, fire rockets, and compete for score",
      "Metering for billable actions, with a hard spending limit that can pause costly activity",
      "Built-in access checks, input validation, protected operator controls, status monitoring, and recovery tools",
      "A development process for a codebase written entirely by AI",
      "Policies mapped to ISO/IEC 27001 and ISO/IEC 42001, with each supported claim linked to evidence",
      "Service records for releases, uptime, operator actions, resource use, backups, and recovery tests",
      "Keyboard support, visible focus, screen-reader updates, zoom support, and reduced-motion options"
    ],
    architecture: [
      ["Browser", "Game surface and public trust routes"],
      ["Worker", "Routing, validation, policy, and evidence surfaces"],
      ["Durable Objects", "Rooms, state, sockets, logs, and receipts"],
      ["R2", "Daily state copies and restore evidence"]
    ],
    engineering: "The controls are part of the same service as the game. New functionality goes through the same ISO-aligned rules for security, AI-generated code, change, cost, recovery, and evidence. The running service keeps the records that show those rules were followed.",
    result: "Shark Tank is a playable multiplayer game built entirely with AI-generated code. It runs with ISO-aligned security and operating practices, limits its billable activity, documents its policies, and maintains evidence from the live service. It demonstrates alignment; it does not claim certification.",
    narrative: {
      tagline: "A multiplayer shark game built entirely with AI-generated code.",
      what: "Players swim through a shared tank, eat food, dash forward, fire rockets, and compete for score. The live game also includes security checks, billable-action limits, status monitoring, backups, recovery tools, and public operating records.",
      why: "Realtime gameplay uses cloud resources that cost money, accepts public input, and changes over time. Shark Tank was built to handle those everyday operating needs from the start while also governing a codebase produced entirely by AI.",
      highlights: ["Realtime multiplayer shark gameplay", "A codebase written entirely by AI", "ISO/IEC 27001-aligned security and operating controls", "ISO/IEC 42001-aligned management of AI development", "Metered billable actions with a hard spending limit"]
    },
  },
  {
    id: "hexframe",
    slug: "hexframe",
    name: "Hexframe",
    number: "02",
    eyebrow: "Deterministic systems",
    summary: "A browser fighting game where every hit has one repeatable result. It includes accessible controls, training tools, replays, computer players, and a foundation for future online play.",
    primaryCapability: "Deterministic combat simulation",
    characteristics: ["Deterministic simulation", "Rollback architecture", "WCAG 2.0 AA interfaces", "Training tools", "Accessible controls"],
    liveUrl: "https://hexframe.wizardgang.ai/play/",
    sourceUrl: "https://github.com/Wizard-Gang/Hexframe",
    preview: { id: "hexframe-training", kind: "motion-controlled", fixture: "product-recreation" },
    caseStudy: { title: "Deterministic Fighting Game Systems" },
    problem: "The match, training screen, computer player, replay, saved game, and future online mode all need to agree about what happened. If each part calculates combat differently, a punch could hit in one view and miss in another. Hexframe therefore calculates the fight in one place and lets every feature read the same result.",
    built: [
      "A playable training stage with one fighter and one practice dummy",
      "Pause, play, or move forward and backward through the fight one frame at a time",
      "Freeze automatically when a hit connects so the exact contact can be inspected",
      "Show or hide hitboxes, hurtboxes, pushboxes, character origins, and skeletons",
      "Read damage, movement, hitstun, blockstun, and fighter state for the selected frame",
      "Save a position, capture its inputs, and replay the same scenario",
      "Use the lab with keyboard or gamepad and adjust focus, text size, contrast, color labels, and motion"
    ],
    architecture: [
      ["Controls", "Read player buttons and choices made by computer teammates"],
      ["Game rules", "Calculate movement, hits, damage, and status effects"],
      ["Saved state", "Store exact moments for saves, replays, and rollback"],
      ["Graphics", "Draw characters and effects from results that are already decided"]
    ],
    engineering: "Hexframe decides whether a hit landed before it draws the punch or spark. Training, replay, computer players, and future online play all read that same result. This keeps browser speed and visual timing from changing who won.",
    result: "You can play matches, build move sets, use accessible menus, train with frame data, save progress, and fight with computer teammates. Because every feature uses the same combat rules, the project can add characters, tools, and online play without rebuilding its foundation.",
    narrative: {
      tagline: "Fighting-game systems made deterministic and inspectable.",
      what: "A browser-based fighting-game system and engineering laboratory built around fixed-step combat, authored frame data, replayable state, rollback-ready boundaries, keyboard and gamepad parity, semantic menus, and accessible training tools.",
      why: "Fighting games compress hard engineering problems into a visible system: timing, input, simulation authority, animation, collision, debugging, accessibility, and tools all have to agree on what happened.",
      highlights: ["A playable stage with a practice dummy", "Pause-on-contact and frame-by-frame controls", "Hitbox, hurtbox, pushbox, and state inspection", "Saved positions and repeatable scenario replays", "Keyboard, gamepad, and accessible display settings"]
    },
  },
  {
    id: "yarreader",
    slug: "yarreader",
    name: "YarReader",
    number: "03",
    eyebrow: "Portable media pipeline",
    summary: "An offline comic and book library that turns mixed files into a checked, portable reader and can safely continue after a crash or interrupted copy.",
    primaryCapability: "Offline, recoverable media pipeline",
    technologies: ["TypeScript", "CLI", "Static HTML"],
    characteristics: ["Content addressing", "Crash recovery", "Verified exports", "Offline-first"],
    liveUrl: null,
    sourceUrl: "https://github.com/Wizard-Gang/YarReader",
    preview: { id: "yarreader-library", kind: "static", fixture: "synthetic-demo" },
    caseStudy: { title: "Portable Media Pipeline" },
    problem: "A single folder may contain comics, ebooks, PDFs, loose images, duplicate editions, and half-finished downloads. YarReader must protect the original files, recover after an interruption, and never replace the working library with an incomplete copy.",
    built: [
      "Readers for six common source types, including comic archives, ebooks, PDFs, and image folders",
      "A SHA-256 digital fingerprint for every file, so renamed copies can still be recognized",
      "Optional AI suggestions that must pass format checks and receive human approval",
      "A work journal that lets long copy and archive jobs continue after a crash",
      "The same page-conversion rules every time, producing versioned WebP images",
      "A complete new library is checked before it replaces the old one; the finished reader needs no server"
    ],
    architecture: [
      ["Inspect", "Open each source safely and record what it contains"],
      ["Identify", "Match the book using rules first, optional AI second, and a person when needed"],
      ["Convert", "Turn pages into consistent images with digital fingerprints"],
      ["Publish", "Check the entire new library before making it the active copy"]
    ],
    engineering: "All difficult work—opening formats, checking files, and converting pages—happens before the reader opens. The finished library is ordinary HTML and images with local links, so it can be copied to a drive and used without internet access.",
    result: "If a copy or conversion stops, YarReader continues from its work journal. Different editions keep clear identities. Every finished library is checked before use and never changes afterward. If generated files are lost, they can be rebuilt from the protected originals and catalog.",
    narrative: {
      tagline: "A portable media library that works without a server.",
      what: "A browser-based reading experience backed by a crash-recoverable pipeline that converts mixed publication formats into a verified, self-contained offline library.",
      why: "Portable archives fail when readers depend on a database, a network, or fragile application state. YarReader pushes complexity into the build pipeline so the activated library stays ordinary, durable, and movable.",
      highlights: ["CBZ, CBR, EPUB, PDF, and image adapters", "Content-addressed normalization", "Crash-recoverable transactions", "Immutable static exports with an offline reader"]
    },
  }
] as const satisfies readonly ProjectRecord[];


export function projectActionsFor(project: ProjectRecord, surface: ProjectActionSurface): readonly ProjectAction[] {
  const projectAction: ProjectAction = {
    id: "project",
    label: "View project",
    ariaLabel: `View ${project.name} project`,
    href: projectPath(project.slug),
    external: false,
    primary: surface === "card" || surface === "case-study"
  };
  const liveAction: ProjectAction | null = project.liveUrl ? {
    id: "live",
    label: "Open live demo",
    ariaLabel: `Open ${project.name} live demo`,
    href: project.liveUrl,
    external: true,
    primary: surface === "overview"
  } : null;
  const caseStudyAction: ProjectAction | null = project.caseStudy ? {
    id: "case-study",
    label: "View case study",
    ariaLabel: `View ${project.name} case study`,
    href: projectCaseStudyPath(project.slug),
    external: false,
    primary: surface === "overview" && !liveAction
  } : null;
  const evidenceAction: ProjectAction | null = project.operationsUrl ? {
    id: "evidence",
    label: "Explore evidence",
    ariaLabel: `Explore ${project.name} operating evidence`,
    href: project.operationsUrl,
    external: true,
    primary: false
  } : null;
  const sourceAction: ProjectAction = {
    id: "source",
    label: "View source",
    ariaLabel: `View ${project.name} source on GitHub`,
    href: project.sourceUrl,
    external: true,
    primary: surface === "overview" && !liveAction && !caseStudyAction
  };

  if (surface === "card") {
    return [projectAction, ...(liveAction ? [liveAction] : []), ...(caseStudyAction ? [caseStudyAction] : []), ...(!liveAction ? [sourceAction] : [])];
  }
  if (surface === "overview") {
    return [...(liveAction ? [liveAction] : []), ...(caseStudyAction ? [caseStudyAction] : []), ...(evidenceAction ? [evidenceAction] : []), sourceAction];
  }
  return [projectAction, ...(liveAction ? [liveAction] : []), ...(evidenceAction ? [evidenceAction] : []), sourceAction];
}

export function projectOverviewMetadata(project: ProjectRecord): PageMetadata {
  return {
    title: `${project.name} — WizardGang Project`,
    description: `${project.narrative.tagline} ${project.narrative.what}`,
    path: projectPath(project.slug),
  };
}

export function projectCaseStudyMetadata(project: ProjectRecord): PageMetadata | null {
  if (!project.caseStudy) return null;
  return {
    title: `${project.name} — ${project.caseStudy.title} Case Study | WizardGang`,
    description: project.summary,
    path: projectCaseStudyPath(project.slug),
  };
}

function assertHttpsUrl(value: string, label: string): void {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error(`${label} must use HTTPS`);
}

function assertUniqueStrings(values: readonly string[] | undefined, label: string): void {
  if (!values) return;
  const normalized = values.map((value) => value.trim().toLowerCase());
  if (normalized.some((value) => !value)) throw new Error(`${label} contains an empty value`);
  if (new Set(normalized).size !== normalized.length) throw new Error(`${label} contains duplicate values`);
}

export function validateProjectRecords(records: readonly ProjectRecord[]): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const previewIds = new Set<string>();
  const routes = new Set<string>();

  for (const project of records) {
    if (!project.id.trim() || !project.slug.trim() || !project.name.trim() || !project.summary.trim() || !project.primaryCapability.trim()) {
      throw new Error(`Incomplete project record: ${project.slug || project.id}`);
    }
    if (project.id !== project.slug) throw new Error(`Project id and slug must match: ${project.id} / ${project.slug}`);
    if (ids.has(project.id)) throw new Error(`Duplicate project id: ${project.id}`);
    if (slugs.has(project.slug)) throw new Error(`Duplicate project slug: ${project.slug}`);
    ids.add(project.id);
    slugs.add(project.slug);

    assertHttpsUrl(project.sourceUrl, `${project.slug} sourceUrl`);
    if (project.liveUrl) assertHttpsUrl(project.liveUrl, `${project.slug} liveUrl`);
    if (project.operationsUrl) assertHttpsUrl(project.operationsUrl, `${project.slug} operationsUrl`);
    assertUniqueStrings(project.technologies, `${project.slug} technologies`);
    assertUniqueStrings(project.characteristics, `${project.slug} characteristics`);

    const overviewPath = projectPath(project.slug);
    if (!overviewPath.startsWith(PROJECTS_ROOT_PATH)) throw new Error(`Invalid canonical project path: ${overviewPath}`);
    if (routes.has(overviewPath)) throw new Error(`Duplicate project route: ${overviewPath}`);
    routes.add(overviewPath);

    if (project.caseStudy) {
      if (!project.caseStudy.title.trim()) throw new Error(`Empty case-study title: ${project.slug}`);
      const casePath = projectCaseStudyPath(project.slug);
      if (routes.has(casePath)) throw new Error(`Duplicate project route: ${casePath}`);
      routes.add(casePath);
    }

    if (project.preview) {
      if (!project.preview.id.trim()) throw new Error(`Empty preview id: ${project.slug}`);
      if (previewIds.has(project.preview.id)) throw new Error(`Duplicate project preview id: ${project.preview.id}`);
      previewIds.add(project.preview.id);
      if (!["motion-controlled", "static"].includes(project.preview.kind)) throw new Error(`Invalid project preview kind: ${project.preview.kind}`);
      if (!["product-recreation", "synthetic-demo"].includes(project.preview.fixture)) throw new Error(`Invalid project preview fixture: ${project.preview.fixture}`);
    }
  }
}

validateProjectRecords(projects);

export const projectBySlug = new Map<ProjectSlug, ProjectRecord>(
  projects.map((project) => [project.slug, project] as const)
);

export const projectRoutes = projects.flatMap((project) => [
  projectOutputPath(project.slug),
  ...(project.caseStudy ? [projectCaseStudyOutputPath(project.slug)] : [])
]);

export const PROJECTS_INDEX_METADATA: PageMetadata = {
  title: "Projects — WizardGang Software",
  description: "WizardGang software projects: SharkTank, Hexframe, and YarReader, with technical case studies, source, and live proof where available.",
  path: PROJECTS_ROOT_PATH
};

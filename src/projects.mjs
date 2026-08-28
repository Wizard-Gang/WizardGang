export const projects = [
  {
    name: "Shark Tank",
    slug: "sharktank",
    number: "01",
    eyebrow: "Security & AI governance",
    description: "A live production systems laboratory for ISO/IEC 27001:2022 and ISO/IEC 42001:2023 readiness, connecting risk, controls, operations, and AI-system governance to evidence from the running service.",
    tags: ["ISO/IEC 27001", "ISO/IEC 42001", "Risk management", "AI governance", "Cloudflare", "Operations"],
    liveUrl: "https://sharktank.wizardgang.ai/play/",
    operationsUrl: "https://sharktank.wizardgang.ai/trust/",
    sourceUrl: null,
    sourcePublic: false,
    problem: "Compliance claims are easy to write and difficult to prove. Shark Tank asks whether security and AI governance can be made inspectable from the same production system they describe, without confusing a readiness exercise with certification.",
    built: [
      "A public 184-row readiness register spanning ISO/IEC 27001:2022 and ISO/IEC 42001:2023",
      "Policies, risk treatment, control positions, objectives, and AI impact assessment published as inspectable routes",
      "Evidence links that resolve from register rows into the running system rather than screenshots or slideware",
      "Public operational records for availability, incidents, changes, spend controls, backups, and restore drills",
      "Deterministic rule-based agent behavior with explicit purpose, limits, monitoring, and change control",
      "Honest partial, supplier-inherited, excluded, and gap states instead of overstating readiness"
    ],
    architecture: [
      ["Browser", "Game surface and public trust routes"],
      ["Worker", "Routing, validation, policy, and evidence surfaces"],
      ["Durable Objects", "Rooms, state, sockets, logs, and receipts"],
      ["R2", "Daily state copies and restore evidence"]
    ],
    engineering: "The management-system layer is part of the product. A control is not treated as evidenced merely because it is described; the register points to a live route that demonstrates the implementation or records the remaining limitation.",
    result: "A live ISO-aligned readiness exercise, not a certification claim: visitors can inspect the control register, policies, risks, operational history, recovery evidence, AI-system boundaries, and known gaps before they ever play the game."
  },
  {
    name: "Hexframe",
    slug: "hexframe",
    number: "02",
    eyebrow: "Deterministic systems",
    description: "A deterministic 2D fighting-game simulator and training laboratory built around fixed-step simulation, rollback, authored combat, and SVG rendering.",
    tags: ["TypeScript", "60 Hz simulation", "Rollback", "Training tools", "SVG", "Cloudflare"],
    liveUrl: "https://hexframe.wizardgang.ai/play/",
    sourceUrl: null,
    sourcePublic: false,
    problem: "Combat has to mean the same thing to play, training, AI, replay, saves, and eventual network rollback. Browser timing, presentation state, and ambient randomness cannot be allowed to define the result.",
    built: [
      "A fixed 60 Hz integer simulation with explicit snapshots and hashes",
      "Authored moves, loadouts, equipment, crafting, and deterministic status systems",
      "Replay and rollback contracts shared by training and future networking",
      "Party AI that uses the same authored loadouts as the player",
      "Independent SVG rigs with presentation kept outside combat authority",
      "A protected engineering lab for deterministic inspection"
    ],
    architecture: [
      ["Input", "Player and deterministic AI decisions"],
      ["Simulation", "Fixed-step integer combat rules"],
      ["State", "Snapshots, hashes, saves, replay"],
      ["Renderer", "SVG rigs, VFX, interpolation"]
    ],
    engineering: "One authoritative model supports every downstream consumer. Rendering observes combat; it never decides it. That boundary makes training tools and rollback infrastructure part of the product architecture rather than later patches.",
    result: "A playable systems slice with authored combat, first-class training, persistent progression, party behavior, and rollback-ready state boundaries that can grow without replacing the combat core."
  },
  {
    name: "YarReader",
    slug: "yarreader",
    number: "03",
    eyebrow: "Portable media pipeline",
    description: "A crash-recoverable pipeline that turns mixed publication formats into a verified static HTML library designed for offline and removable storage.",
    tags: ["TypeScript", "CLI", "Content addressing", "Recovery", "Static HTML", "Offline"],
    liveUrl: null,
    sourceUrl: null,
    sourcePublic: false,
    problem: "CBZ, CBR, EPUB, PDF, loose images, duplicate releases, interrupted copies, and incomplete downloads all enter through one inbox. The system must preserve originals and never activate an export it has not completely verified.",
    built: [
      "Explicit adapters for six source families",
      "Full SHA-256 content identities and stable discovery",
      "Schema-validated AI proposals with human review",
      "Prepared, recoverable archive transactions",
      "Deterministic page normalization to versioned WebP",
      "Atomic immutable export generations with a no-server reader"
    ],
    architecture: [
      ["Inspect", "Stable sources and explicit adapters"],
      ["Classify", "Deterministic, AI, then human review"],
      ["Normalize", "Versioned pages with content hashes"],
      ["Export", "Validate, rename, activate"]
    ],
    engineering: "Complexity stays in the workstation pipeline. The activated reader is ordinary relative HTML and image files, so it remains portable across removable storage and offline environments.",
    result: "Interrupted work resumes from durable journals, alternate releases retain explicit identity, and every activated generation is immutable and verified. Derived output can be rebuilt from the archive and catalog."
  }
];

export const projectBySlug = new Map(projects.map((project) => [project.slug, project]));

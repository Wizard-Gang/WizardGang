export const projects = [
  {
    name: "Hexframe",
    slug: "hexframe",
    number: "01",
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
    number: "02",
    eyebrow: "Portable media pipeline",
    description: "A crash-recoverable ingestion and archival pipeline that converts mixed publication formats into a portable static HTML library.",
    tags: ["TypeScript", "CLI", "Content addressing", "Archive recovery", "Static HTML", "Offline"],
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
      ["Archive", "Prepared transaction and recovery"],
      ["Export", "Validate, rename, activate"]
    ],
    engineering: "Complexity stays in the workstation pipeline. The activated reader is ordinary relative HTML and image files, so it remains portable across removable storage and offline environments.",
    result: "Interrupted work resumes from durable journals, alternate releases retain explicit identity, and every activated generation is immutable and verified. Derived output can be rebuilt from the archive and catalog."
  },
  {
    name: "Shark Tank",
    slug: "sharktank",
    number: "03",
    eyebrow: "Realtime edge systems",
    description: "A real-time Cloudflare systems project combining multiplayer simulation with Durable Objects, WebSockets, observability, cost controls, incident handling, and security evidence.",
    tags: ["Cloudflare Workers", "Durable Objects", "WebSockets", "REST APIs", "Security", "Operations"],
    liveUrl: "https://sharktank.wizardgang.ai/play/",
    operationsUrl: "https://sharktank.wizardgang.ai/trust/",
    sourceUrl: null,
    sourcePublic: false,
    problem: "Realtime play is only the visible layer. The useful engineering problem is operating it: authoritative rooms, reconnectable sockets, durable profiles, bounded writes, recovery, incident history, and a hard ceiling on variable spend.",
    built: [
      "Authoritative room objects with hibernatable WebSockets",
      "Durable profiles, leaderboard state, and bounded public writes",
      "Public status, incident, evidence, API, and governance surfaces",
      "Authenticated maintenance, billing, backup, and recovery controls",
      "Daily object-storage state copies and digest-based restore drills",
      "Measured usage and a hard spend gate that closes game traffic"
    ],
    architecture: [
      ["Browser", "Input, prediction, Three.js view"],
      ["Worker", "Routes, validation, policy, assets"],
      ["Durable Objects", "Rooms, sockets, state, receipts"],
      ["R2", "Daily state copies and restore drills"]
    ],
    engineering: "The operations layer is evidence, not decoration. Availability, receipts, incidents, spend, controls, and open gaps are inspectable without exposing the operator console.",
    result: "A small multiplayer game that doubles as a legible production system: visitors can play in seconds, while engineers can follow the networking, recovery, cost, and security evidence as far as they want."
  }
];

export const projectBySlug = new Map(projects.map((project) => [project.slug, project]));

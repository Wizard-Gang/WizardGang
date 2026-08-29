export const projects = [
  {
    name: "SharkTank",
    slug: "sharktank",
    number: "01",
    eyebrow: "Security & AI governance",
    description: "A realtime production workload demonstrating ISO/IEC 27001- and ISO/IEC 42001-aligned governance through live controls, operational evidence, accessible interfaces, controlled spend, and defined degradation.",
    tags: ["ISO/IEC 27001 aligned", "ISO/IEC 42001 aligned", "WCAG 2.0 AA interfaces", "Live evidence", "Cost governance"],
    capabilities: ["ISO 27001", "ISO 42001", "WCAG", "Live Uptime", "Cost Governance"],
    liveUrl: "https://sharktank.wizardgang.ai/play/",
    operationsUrl: "https://sharktank.wizardgang.ai/evidence/",
    sourceUrl: "https://github.com/Wizard-Gang/SharkTank",
    problem: "Compliance claims are easy to write and difficult to prove. Shark Tank asks whether security and AI governance can be made inspectable from the same production system they describe, without confusing a readiness exercise with certification.",
    built: [
      "A public 184-row readiness register spanning ISO/IEC 27001:2022 and ISO/IEC 42001:2023",
      "Policies, risk treatment, control positions, objectives, and AI impact assessment published as inspectable routes",
      "Evidence links that resolve from register rows into the running system rather than screenshots or slideware",
      "Public operational records for availability, incidents, changes, spend controls, backups, and restore drills",
      "Keyboard-operable public and game interfaces with visible focus, semantic status output, adaptable presentation, and reduced-motion support",
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
    result: "A live ISO-aligned readiness exercise, not a certification claim: visitors can inspect security governance, AI governance, reliability, accessibility, cost boundaries, recovery evidence, and known gaps before they play the governed workload."
  },
  {
    name: "Hexframe",
    slug: "hexframe",
    number: "02",
    eyebrow: "Deterministic systems",
    description: "An interactive fighting-game system combining deterministic simulation and rollback-ready state with accessible controls, semantic menus, adaptable presentation, and first-class training tools.",
    tags: ["Deterministic simulation", "Rollback architecture", "WCAG 2.0 AA interfaces", "Training tools", "Accessible controls"],
    capabilities: ["Deterministic Simulation", "Rollback Architecture", "WCAG", "Training Tools", "Accessible Controls"],
    liveUrl: "https://hexframe.wizardgang.ai/play/",
    sourceUrl: "https://github.com/Wizard-Gang/Hexframe",
    problem: "Combat has to mean the same thing to play, training, AI, replay, saves, and eventual network rollback. Browser timing, presentation state, and ambient randomness cannot be allowed to define the result.",
    built: [
      "A fixed 60 Hz integer simulation with explicit snapshots and hashes",
      "Authored moves, loadouts, equipment, crafting, and deterministic status systems",
      "Replay and rollback contracts shared by training and future networking",
      "Party AI that uses the same authored loadouts as the player",
      "Independent SVG rigs with presentation kept outside combat authority",
      "A protected engineering lab for deterministic inspection",
      "Keyboard and gamepad operation, semantic menus, strong focus handling, scalable text, reduced-motion, contrast and color-vision controls"
    ],
    architecture: [
      ["Input", "Player and deterministic AI decisions"],
      ["Simulation", "Fixed-step integer combat rules"],
      ["State", "Snapshots, hashes, saves, replay"],
      ["Renderer", "SVG rigs, VFX, interpolation"]
    ],
    engineering: "One authoritative model supports every downstream consumer. Rendering observes combat; it never decides it. That boundary makes training tools and rollback infrastructure part of the product architecture rather than later patches.",
    result: "A playable systems slice with authored combat, accessible menus and training workflows, persistent progression, party behavior, and rollback-ready state boundaries that can grow without replacing the combat core."
  },
  {
    name: "YarReader",
    slug: "yarreader",
    number: "03",
    eyebrow: "Portable media pipeline",
    description: "A portable offline media library with a browser-based reading interface and a crash-recoverable pipeline for verified, self-contained deployment.",
    tags: ["TypeScript", "CLI", "Content addressing", "Recovery", "Static HTML", "Offline"],
    capabilities: ["Offline-first", "Content Addressing", "Crash Recovery", "Verified Exports"],
    liveUrl: null,
    sourceUrl: "https://github.com/Wizard-Gang/YarReader",
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

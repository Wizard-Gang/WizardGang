export const projects = [
  {
    name: "SharkTank",
    slug: "sharktank",
    number: "01",
    eyebrow: "Artificial-intelligence-developed multiplayer game",
    description: "A live multiplayer shark game built entirely with code created by artificial intelligence (AI), with measured cloud costs, accessible interfaces, and built-in security, reliability, and operating controls.",
    tags: ["Multiplayer game", "100% artificial-intelligence-developed", "ISO/IEC 27001 aligned", "ISO/IEC 42001 aligned", "Built-in cost controls"],
    capabilities: ["ISO 27001", "ISO 42001", "WCAG", "Live Uptime", "Cost Governance"],
    liveUrl: "https://sharktank.wizardgang.ai/play/",
    operationsUrl: "https://sharktank.wizardgang.ai/evidence/",
    sourceUrl: "https://github.com/Wizard-Gang/SharkTank",
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
    result: "Shark Tank is a playable multiplayer game built entirely with AI-generated code. It runs with ISO-aligned security and operating practices, limits its billable activity, documents its policies, and maintains evidence from the live service. It demonstrates alignment; it does not claim certification."
  },
  {
    name: "Hexframe",
    slug: "hexframe",
    number: "02",
    eyebrow: "Deterministic systems",
    description: "A browser fighting game where every hit has one repeatable result. It includes accessible controls, training tools, replays, computer players, and a foundation for future online play.",
    tags: ["Deterministic simulation", "Rollback architecture", "WCAG 2.0 AA interfaces", "Training tools", "Accessible controls"],
    capabilities: ["Deterministic Simulation", "Rollback Architecture", "WCAG", "Training Tools", "Accessible Controls"],
    liveUrl: "https://hexframe.wizardgang.ai/play/",
    sourceUrl: "https://github.com/Wizard-Gang/Hexframe",
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
    result: "You can play matches, build move sets, use accessible menus, train with frame data, save progress, and fight with computer teammates. Because every feature uses the same combat rules, the project can add characters, tools, and online play without rebuilding its foundation."
  },
  {
    name: "YarReader",
    slug: "yarreader",
    number: "03",
    eyebrow: "Portable media pipeline",
    description: "An offline comic and book library that turns mixed files into a checked, portable reader and can safely continue after a crash or interrupted copy.",
    tags: ["TypeScript", "CLI", "Content addressing", "Recovery", "Static HTML", "Offline"],
    capabilities: ["Offline-first", "Content Addressing", "Crash Recovery", "Verified Exports"],
    liveUrl: null,
    sourceUrl: "https://github.com/Wizard-Gang/YarReader",
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
    result: "If a copy or conversion stops, YarReader continues from its work journal. Different editions keep clear identities. Every finished library is checked before use and never changes afterward. If generated files are lost, they can be rebuilt from the protected originals and catalog."
  }
];

export const projectBySlug = new Map(projects.map((project) => [project.slug, project]));

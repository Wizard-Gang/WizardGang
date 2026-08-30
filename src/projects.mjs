export const projects = [
  {
    name: "SharkTank",
    slug: "sharktank",
    number: "01",
    eyebrow: "Security & AI governance",
    description: "An online shark game with public records for its security rules, bot limits, uptime, accessible interfaces, spending limit, incidents, and backups.",
    tags: ["ISO/IEC 27001 aligned", "ISO/IEC 42001 aligned", "WCAG 2.0 AA interfaces", "Live evidence", "Cost governance"],
    capabilities: ["ISO 27001", "ISO 42001", "WCAG", "Live Uptime", "Cost Governance"],
    liveUrl: "https://sharktank.wizardgang.ai/play/",
    operationsUrl: "https://sharktank.wizardgang.ai/evidence/",
    sourceUrl: "https://github.com/Wizard-Gang/SharkTank",
    problem: "Anyone can write a policy that says a service is secure. The hard part is showing what the service actually does. Shark Tank puts its rules, records, limits, and known problems next to a real online game so visitors can check them. It follows the structure of two ISO standards as a practice exercise; it is not certified.",
    built: [
      "A public checklist covering 184 security and AI-governance requirements",
      "Plain records showing which rules are complete, incomplete, handled by a supplier, or not relevant",
      "Links from each supported claim to a live page or record from the running service",
      "Public history for uptime, incidents, code changes, spending limits, backups, and recovery tests",
      "Keyboard support, visible focus, screen-reader updates, zoom support, and reduced-motion options",
      "Computer sharks that follow fixed rules with published limits and tests",
      "Known gaps shown openly instead of being described as finished"
    ],
    architecture: [
      ["Browser", "Game surface and public trust routes"],
      ["Worker", "Routing, validation, policy, and evidence surfaces"],
      ["Durable Objects", "Rooms, state, sockets, logs, and receipts"],
      ["R2", "Daily state copies and restore evidence"]
    ],
    engineering: "A written rule is not counted as proof by itself. Each supported claim links to a live page or record that shows what the service did. If proof is missing, the site records the limit instead of hiding it.",
    result: "Shark Tank is a live practice project, not a certification. Before playing, visitors can see how it handles security, computer-controlled players, uptime, accessibility, spending limits, backups, and unfinished work."
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
      "Combat updates exactly 60 times per second and uses whole-number math, so the same inputs produce the same result",
      "Moves, equipment, crafting, and status effects are stored as readable game data instead of being hidden in animation code",
      "Replays and future online rollback can save and restore the same exact match state",
      "Computer teammates choose from the same moves and equipment available to the player",
      "Characters are drawn with SVG graphics, but those graphics cannot change damage, timing, or collisions",
      "An engineering lab shows move frames, hitboxes, damage, and saved state",
      "Accessible controls for keyboard and gamepad, plus clear focus, larger text, reduced motion, stronger contrast, and color labels"
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

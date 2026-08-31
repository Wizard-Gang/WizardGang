import { projects } from "./projects.mjs";
import { professionalRoles, professionalSkills } from "./professional.mjs";
import { deployments, integrationGroups, systemGroups } from "./professional-systems.mjs";

const SITE_ORIGIN = "https://wizardgang.ai";
const GITHUB = "https://github.com/Wizard-Gang";
const LINKEDIN = "https://www.linkedin.com/in/jacob-yongue";
const CONTACT_EMAIL = "jacob@wizardgang.ai";
const WEBSITE_PACKAGES = [
  {
    name: "Starter",
    price: "$95",
    pages: "Up to 3 pages",
    description: "A focused site for a small business that needs a credible home, clear services, and a direct contact path.",
    features: ["Responsive design", "Home, services, and contact routes", "Direct email and contact details", "Owner-controlled source and deployment"]
  },
  {
    name: "Business",
    price: "$195",
    pages: "Up to 5 pages",
    description: "A broader business site with room to show the work, establish trust, and collect useful customer inquiries.",
    features: ["Everything in Starter", "Gallery and testimonial sections", "Service-area content", "First-party contact form"]
  },
  {
    name: "Owner+",
    price: "$350",
    pages: "Up to 8 pages",
    description: "A complete site with dedicated pages, stored contact requests, and documentation for future maintenance.",
    features: ["Everything in Business", "FAQ and expanded content routes", "Stored contact submissions", "AI-ready documentation and automated deployment"]
  }
];

const escapeHtml = (value) => String(value).replace(/[&<>\"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;"
})[character]);

function header(current = "") {
  const nav = [
    ["projects", "/projects/", "Projects"],
    ["work", "/work/", "Work"],
    ["about", "/about/", "About"],
    ["", `mailto:${CONTACT_EMAIL}`, "Contact"],
    ["", GITHUB, "GitHub"]
  ].map(([key, href, label]) => `<a href="${href}"${href === GITHUB ? ' aria-label="Visit WizardGang on GitHub"' : ""}${current === key ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <a class="wordmark" href="/" aria-label="Jacob Yongue portfolio home"><span class="wordmark-mark" aria-hidden="true"></span><span class="wordmark-copy"><strong>JACOB YONGUE</strong><small>wizardgang.ai</small></span></a>
      <nav class="site-nav site-nav-desktop" aria-label="Primary">${nav}</nav>
      <details class="nav-disclosure">
        <summary class="nav-toggle"><span>Menu</span><span class="nav-toggle-icon" aria-hidden="true"><i></i><i></i><i></i></span></summary>
        <nav class="site-nav site-nav-mobile" aria-label="Primary mobile">${nav}</nav>
      </details>
    </header>`;
}

function displaySettings() {
  return `<details class="display-settings">
    <summary>Preferences</summary>
    <section class="settings-toolbar" aria-label="Language, display, and motion preferences">
      <label class="setting-language"><span>Language</span><select id="page-language" autocomplete="off"><option value="en">English</option><option value="es">Español</option></select></label>
      <fieldset class="setting-theme">
        <legend>Theme</legend>
        <label><input type="radio" name="page-theme" id="theme-dark" checked> Dark</label>
        <label><input type="radio" name="page-theme" id="theme-light"> Light</label>
      </fieldset>
      <label class="setting-toggle"><input type="checkbox" id="reading-layout" checked><span>Readable layout</span></label>
      <label class="setting-toggle"><input type="checkbox" id="text-size-200"><span>200% text</span></label>
      <label class="setting-toggle"><input type="checkbox" id="play-previews" aria-describedby="motion-setting-help" checked><span>Play previews</span></label>
      <small class="sr-only" id="motion-setting-help">Previews play by default. Turn this off to pause them; reduced-motion preferences are always respected.</small>
    </section>
  </details>`;
}

function footer(build, current = "") {
  const contact = `<span class="footer-contact"><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><a href="${LINKEDIN}">LinkedIn <span aria-hidden="true">↗</span></a></span>`;
  return `<footer class="site-footer"><span>Jacob Yongue · Software engineering portfolio</span>${contact}<span>WizardGang.ai · <a href="/version.json">Build ${escapeHtml(build.commit)}</a></span></footer>`;
}

function document({ title, description, path, current, body, build, social = false, noindex = false }) {
  const canonical = `${SITE_ORIGIN}${path}`;
  // The visible build label remains the Git hash, while the asset key also changes for
  // verified deployments made from an intentionally dirty working tree.
  const assetVersion = encodeURIComponent(`${build.commit}-${Date.parse(build.builtAt)}`);
  const identity = noindex
    ? '<meta name="robots" content="noindex">'
    : `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}">`;
  const socialImage = social
    ? `<meta property="og:image" content="${SITE_ORIGIN}/og-jacob-yongue.jpg"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Jacob Yongue — software engineer, systems integration, project delivery"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SITE_ORIGIN}/og-jacob-yongue.jpg">`
    : `<meta name="twitter:card" content="summary">`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="#08080b">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    ${identity}
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="WizardGang">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    ${socialImage}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="stylesheet" href="/assets/styles.css?v=${assetVersion}">
    <script src="/assets/site.js?v=${assetVersion}" defer></script>
  </head>
  <body>
    ${header(current)}
    ${displaySettings()}
    ${body}
    ${footer(build, current)}
  </body>
</html>`;
}

const tags = (items, label = "Technologies") => `<ul class="tags" aria-label="${escapeHtml(label)}">${items.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>`;

function actions(project, compact = false) {
  const className = compact ? "text-link" : "button";
  const links = [];

  if (project.slug === "sharktank") {
    if (project.liveUrl) links.push(`<a class="${compact ? "text-link" : "button button-primary"}" href="${project.liveUrl}" aria-label="Play ${escapeHtml(project.name)}">Play <span aria-hidden="true">↗</span></a>`);
    if (project.operationsUrl) links.push(`<a class="${className}" href="${project.operationsUrl}" aria-label="View ${escapeHtml(project.name)} operating evidence">Evidence <span aria-hidden="true">↗</span></a>`);
  } else {
    if (project.liveUrl) links.push(`<a class="${compact ? "text-link" : "button button-primary"}" href="${project.liveUrl}" aria-label="Play ${escapeHtml(project.name)}">Play <span aria-hidden="true">↗</span></a>`);
    if (project.operationsUrl) links.push(`<a class="${className}" href="${project.operationsUrl}" aria-label="View ${escapeHtml(project.name)} operations">Evidence <span aria-hidden="true">↗</span></a>`);
  }

  links.push(`<a class="${className}" href="${project.sourceUrl}" aria-label="View ${escapeHtml(project.name)} source code on GitHub">GitHub <span aria-hidden="true">↗</span></a>`);

  return `<div class="${compact ? "text-links" : "button-row"}">${links.join("")}</div>`;
}

// Both product previews below are traced from the live apps rather than invented: the
// Shark Tank mascot and rocket are the same silhouettes the game rasterises, and the
// Hexframe fighter is the shipped rig. Colours, damage and pushback are copied from the
// products' own authored data, so a change there is visible here as a mismatch.
function sharkTankVisual() {
  return `<div class="project-visual tank-preview" role="img" aria-label="Shark Tank gameplay: rival sharks chase and eat food dots while the player's cyan shark chomp-dashes and fires a rocket across the live tank">
    <div class="tank-arena">
      <svg viewBox="0 0 800 470" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="tankSea" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="9" r="2.1" fill="#2f7a92" fill-opacity=".5"/>
            <circle cx="31" cy="30" r="1.5" fill="#4b3f86" fill-opacity=".55"/>
          </pattern>
          <symbol id="tankShark" viewBox="0 0 180 110">
            <path d="M35 55 4 26l8 30-8 29 31-25c12 26 67 35 112 4 12-8 20-8 29-9-9-2-17-4-29-12C102 13 47 27 35 55Z" fill="var(--body, #22e6ff)" stroke="#070b14" stroke-width="5" stroke-linejoin="round"/>
            <path d="M76 29 91 5l19 28M76 75 90 102l14-29" fill="var(--accent, #0891b2)" stroke="#070b14" stroke-width="5" stroke-linejoin="round"/>
            <path d="M41 48c24-15 62-22 106-5-43-8-79 1-105 19Z" fill="#fff" opacity=".18"/>
            <circle cx="137" cy="40" r="13" fill="#fff" stroke="#070b14" stroke-width="4"/>
            <circle cx="142" cy="43" r="5" fill="#070b14"/>
            <path d="M119 66q21 16 42-2-21 31-42 2Z" fill="#47142a" stroke="#070b14" stroke-width="4" stroke-linejoin="round"/>
            <path d="m126 69 5 10 6-8 6 8 5-11" fill="#fff" stroke="#070b14" stroke-width="2" stroke-linejoin="round"/>
            <circle cx="158" cy="48" r="3" fill="#070b14"/>
          </symbol>
          <symbol id="tankRocket" viewBox="0 0 72 34">
            <path d="M66 17 47 6H23L9 17l14 11h24Z" fill="#f3f1ff" stroke="#070b14" stroke-width="3" stroke-linejoin="round"/>
            <path d="M25 7 9 1l5 16L9 33l16-6" fill="#ff5a36" stroke="#070b14" stroke-width="3" stroke-linejoin="round"/>
            <circle cx="47" cy="17" r="6" fill="#22e6ff" stroke="#070b14" stroke-width="3"/>
          </symbol>
        </defs>
        <rect width="800" height="470" fill="#0b0a14"/>
        <rect width="800" height="470" fill="url(#tankSea)"/>
        <g stroke="#315468" stroke-opacity=".54" stroke-width="1">
          <path d="M96 0v470M226 0v470M356 0v470M486 0v470M616 0v470"/>
        </g>
        <g class="tank-food" aria-hidden="true">
          <circle cx="196" cy="196" r="3.4" fill="#ffd54a" opacity=".8"/>
          <circle class="tank-food-eat tank-food-eat-a" cx="477" cy="176" r="4.2" fill="#ffd54a"/>
          <circle class="tank-food-eat tank-food-eat-b" cx="297" cy="351" r="4.2" fill="#22e6ff"/>
          <circle class="tank-food-eat tank-food-eat-c" cx="543" cy="376" r="5.2" fill="#ff8a1f"/>
          <circle class="tank-food-eat tank-food-eat-you" cx="449" cy="241" r="4.6" fill="#ffd54a"/>
          <circle cx="243" cy="286" r="3.4" fill="#22e6ff" opacity=".8"/>
          <circle cx="404" cy="150" r="3.4" fill="#ffd54a" opacity=".8"/>
          <circle cx="470" cy="268" r="5" fill="#ff8a1f" opacity=".98"/>
          <circle cx="330" cy="404" r="3.4" fill="#ffd54a" opacity=".8"/>
          <circle cx="150" cy="330" r="3.4" fill="#22e6ff" opacity=".8"/>
          <circle cx="530" cy="196" r="3.4" fill="#ffd54a" opacity=".8"/>
        </g>
        <g class="tank-fish tank-fish-a">
          <use href="#tankShark" x="380" y="150" width="78" height="48" class="skin-gold"/>
        </g>
        <g class="tank-fish tank-fish-b">
          <use href="#tankShark" x="196" y="330" width="70" height="43" class="skin-violet"/>
        </g>
        <g class="tank-fish tank-fish-c">
          <use href="#tankShark" x="424" y="356" width="64" height="39" class="skin-orange"/>
        </g>
        <g class="tank-fish tank-fish-you">
          <g class="tank-dash-trail">
            <circle cx="280" cy="244" r="10" fill="#22e6ff"/>
            <circle cx="258" cy="248" r="7" fill="#fff"/>
            <circle cx="239" cy="241" r="5" fill="#22e6ff"/>
            <circle cx="224" cy="246" r="3.5" fill="#fff"/>
          </g>
          <use href="#tankShark" x="286" y="212" width="106" height="65" class="skin-cyan"/>
        </g>
        <g class="tank-rocket-shot">
          <g class="tank-rocket-flame">
            <circle cx="-8" cy="17" r="7" fill="#ff5a36"/>
            <circle cx="-20" cy="17" r="5" fill="#ffd54a"/>
            <circle cx="-31" cy="17" r="3.5" fill="#ff5a36"/>
          </g>
          <use href="#tankRocket" width="72" height="34"/>
        </g>
        <g transform="translate(702 234)"><g class="tank-rocket-burst">
          <circle cx="-23" cy="-5" r="6" fill="#ff5a36"/>
          <circle cx="-13" cy="-19" r="5" fill="#ffd54a"/>
          <circle cx="4" cy="-24" r="4" fill="#fff"/>
          <circle cx="19" cy="-14" r="6" fill="#ff8a1f"/>
          <circle cx="25" cy="4" r="5" fill="#ffd54a"/>
          <circle cx="12" cy="20" r="6" fill="#ff5a36"/>
          <circle cx="-7" cy="24" r="4" fill="#fff"/>
          <circle cx="-22" cy="14" r="5" fill="#ff8a1f"/>
          <circle r="10" fill="#fff"/>
        </g></g>
      </svg>
    </div>
    <div class="tank-readout">
      <div class="tank-card"><span>Points</span><strong>2</strong></div>
      <div class="tank-card"><span>Rank</span><strong>16<small> / 24</small></strong></div>
      <div class="tank-card"><span>Size</span><strong>1.0<small>×</small></strong></div>
    </div>
    <div class="tank-board">
      <p class="tank-board-title">Top Sharks</p>
      <ol>
        <li><span>1</span><i class="dot-lime"></i><b>Wriggle</b><em>230</em></li>
        <li><span>2</span><i class="dot-violet"></i><b>Molar</b><em>197</em></li>
        <li><span>3</span><i class="dot-gold"></i><b>Chowder</b><em>177</em></li>
        <li><span>4</span><i class="dot-violet"></i><b>Fang</b><em>134</em></li>
        <li><span>5</span><i class="dot-cyan"></i><b>Barnacle</b><em>50</em></li>
      </ol>
    </div>
    <div class="tank-abilities">
      <span class="tank-ability tank-dash"><svg viewBox="0 0 32 24" aria-hidden="true"><path d="M2 6h13M1 12h11M4 18h11M17 2l13 10-13 10Z"/></svg><b>Dash</b><small>Space</small></span>
      <span class="tank-ability tank-rocket"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19 4c4-2 7-2 9-2 0 2 0 5-2 9L15 22l-6-6L19 4Z"/><path d="m10 16-6 1-2 6 8-2M15 22l-1 8 6-2 1-6M9 23l-6 6"/><circle cx="22" cy="8" r="3"/></svg><b>Rocket</b><small>Shift</small></span>
    </div>
  </div>`;
}

// Frame data copied from Hexframe's authored content so this preview cannot quietly
// drift from the game: moves/*.json supplies the windows, animations/*.json the poses,
// character.json the hurtboxes. Rotations are negated because the renderer flips the
// authored sign once, in rig.ts, when it builds the bone transform.
const LAB_TAKES = [
  {
    id: "a",
    key: "standing_light",
    duration: 18,
    startup: 4,
    active: 2,
    recovery: 12,
    hit: [4, 5],
    cancel: [5, 15],
    hitbox: { x: 26, y: 62, w: 44, h: 20 },
    damage: 30,
    pushback: 3,
    hurtboxes: [[-16, 0, 32, 44], [-18, 44, 36, 38], [-14, 82, 28, 22]],
    keyTimes: "0;0.167;0.222;0.278;0.556;0.94;1",
    pelvis: null,
    bones: {
      torso: "0;6;-9;-10;-4;-0.8;0",
      head: "0;2.25;3;2.81;1.88;0.38;0",
      arm_upper_r: "20;-20;-76;-78;-34;9.2;20",
      arm_lower_r: "46;70;4;0;40;44.8;46"
    },
    still: {}
  },
  {
    id: "b",
    key: "crouching_light",
    duration: 16,
    startup: 4,
    active: 3,
    recovery: 9,
    hit: [4, 6],
    cancel: [6, 13],
    hitbox: { x: 22, y: 12, w: 42, h: 18 },
    damage: 20,
    pushback: 2.2,
    hurtboxes: [[-18, 0, 36, 34], [-18, 34, 36, 22], [-14, 56, 28, 20]],
    keyTimes: "0;0.25;0.375;1",
    pelvis: "0 -32;0 -30;0 -30.33;0 -32",
    bones: {
      torso: "-12;-18;-19;-12",
      arm_upper_r: "34;-54;-58;34",
      arm_lower_r: "60;16;12;60"
    },
    // The crouch is authored on frame 0 only, and the sampler holds a property until the
    // next keyframe that names it, so these legs stay folded for the whole clip.
    still: { leg_upper_l: -62, leg_lower_l: 78, leg_upper_r: 54, leg_lower_r: -70 }
  }
];

function labBone(take, name, pivot, parts) {
  const values = take.bones[name];
  const still = take.still[name];
  const animated = values ? ` class="lab-bone lab-bone-${take.id}-${name}"` : "";
  const held = !values && still !== undefined ? ` transform="rotate(${still})"` : "";
  return `<g transform="translate(${pivot})"><g${animated}${held}>${parts}</g></g>`;
}

function labFighter(take) {
  const footL = labBone(take, "foot_l", "0 22", `<rect x="-4" y="0" width="16" height="6" rx="2.5" fill="var(--far-dark)"/>`);
  const legLowerL = labBone(take, "leg_lower_l", "0 24", `<rect x="-5" y="0" width="10" height="22" rx="4" fill="var(--far)"/>${footL}`);
  const legL = labBone(take, "leg_upper_l", "-1 0", `<rect x="-5.5" y="0" width="11" height="24" rx="4.5" fill="var(--far)"/>${legLowerL}`);

  const footR = labBone(take, "foot_r", "0 22", `<rect x="-4" y="0" width="16" height="6" rx="2.5" fill="var(--near-dark)"/>`);
  const legLowerR = labBone(take, "leg_lower_r", "0 24", `<rect x="-5" y="0" width="10" height="22" rx="4" fill="var(--near)"/>${footR}`);
  const legR = labBone(take, "leg_upper_r", "1 0", `<rect x="-5.5" y="0" width="11" height="24" rx="4.5" fill="var(--near)"/>${legLowerR}`);

  const handL = labBone(take, "hand_l", "0 14", `<circle cx="0" cy="3" r="4.5" fill="var(--far-dark)"/>`);
  const armLowerL = labBone(take, "arm_lower_l", "0 16", `<rect x="-3.5" y="0" width="7" height="14" rx="3" fill="var(--far)"/>${handL}`);
  const armL = labBone(take, "arm_upper_l", "-2 -26", `<rect x="-4" y="0" width="8" height="16" rx="3.5" fill="var(--far)"/>${armLowerL}`);

  const handR = labBone(take, "hand_r", "0 14", `<circle cx="0" cy="3" r="5" fill="var(--near-dark)"/>`);
  const armLowerR = labBone(take, "arm_lower_r", "0 16", `<rect x="-3.5" y="0" width="7" height="14" rx="3" fill="var(--near)"/>${handR}`);
  const armR = labBone(take, "arm_upper_r", "2 -26", `<rect x="-4" y="0" width="8" height="16" rx="3.5" fill="var(--near)"/>${armLowerR}`);

  const head = labBone(take, "head", "0 -30", `<circle cx="1" cy="-11" r="11" fill="var(--body)"/><path d="M 8 -15 L 14 -12 L 8 -9 Z" fill="var(--accent)"/>`);
  const torso = labBone(take, "torso", "0 0", `<rect x="-11" y="-30" width="22" height="30" rx="6" fill="var(--body)"/><rect x="-11" y="-18" width="22" height="3" fill="var(--accent)" opacity=".65"/>${armL}${head}${armR}`);

  const spine = `<rect x="-9" y="-6" width="18" height="12" rx="4" fill="var(--body)"/>${legL}${torso}${legR}`;
  if (!take.pelvis) return `<g transform="translate(0 -46)">${spine}</g>`;
  return `<g class="lab-pelvis lab-pelvis-${take.id}">${spine}</g>`;
}

function labDummy(take) {
  const hurtboxes = [[-16, 0, 32, 44], [-18, 44, 36, 38], [-14, 82, 28, 22]]
    .map(([x, y, w, h]) => labBox(x, y, w, h, "lab-hurtbox")).join("");
  const idle = { bones: {}, still: {}, pelvis: null, keyTimes: "" };
  const contactY = -(take.hitbox.y + take.hitbox.h / 2);
  return `<g class="lab-dummy lab-dummy-${take.id}">
      ${hurtboxes}
      <g class="lab-dummy-body lab-dummy-body-${take.id}"><g transform="scale(-1 1)"><g class="fighter-p2">${labFighter(idle)}</g></g></g>
    </g>
    <g transform="translate(47 ${contactY})"><g class="lab-contact lab-contact-${take.id}">
      <circle class="lab-contact-ring" r="9"/>
      <path class="lab-contact-rays" d="M-16 0H16M0-16V16M-12-12 12 12M12-12-12 12"/>
    </g></g>`;
}

// Boxes are authored with y measured up from the feet; the stage draws y downward.
function labBox(x, y, w, h, className) {
  return `<rect class="${className}" x="${x}" y="${-(y + h)}" width="${w}" height="${h}"/>`;
}

function labTake(take) {
  const hurt = take.hurtboxes.map(([x, y, w, h]) => labBox(x, y, w, h, "lab-hurtbox")).join("");
  const { x, y, w, h } = take.hitbox;
  const hit = `<g class="lab-hit-window lab-hit-window-${take.id}">${labBox(x, y, w, h, "lab-hitbox")}</g>`;
  return `<g class="lab-take lab-take-${take.id}" transform="translate(-30 0)">${hurt}<g class="fighter-p1">${labFighter(take)}</g>${hit}${labDummy(take)}</g>`;
}

function labTimeline(take) {
  const cells = { frame: "", phase: "", hit: "", cancel: "" };
  for (let i = 0; i < take.duration; i += 1) {
    const phase = i < take.startup ? "startup" : i < take.startup + take.active ? "active" : "recovery";
    const phaseLabel = phase === "startup" ? "S" : phase === "active" ? "A" : "R";
    cells.frame += `<span class="lab-cell lab-cell-number">${String(i + 1).padStart(2, "0")}</span>`;
    cells.phase += `<span class="lab-cell lab-on lab-phase-${phase}">${phaseLabel}</span>`;
    cells.hit += `<span class="lab-cell${i >= take.hit[0] && i <= take.hit[1] ? " lab-cell-hit" : ""}">${i >= take.hit[0] && i <= take.hit[1] ? "H" : ""}</span>`;
    cells.cancel += `<span class="lab-cell${i >= take.cancel[0] && i <= take.cancel[1] ? " lab-cell-cancel" : ""}">${i >= take.cancel[0] && i <= take.cancel[1] ? "C" : ""}</span>`;
  }
  const row = (label, body) => `<div class="lab-row"><strong>${label}</strong><div>${body}</div></div>`;
  return `<div class="lab-take lab-take-${take.id} lab-tl lab-tl-${take.duration}">
      <header>
        <div><p>Move timeline / event-derived</p><strong class="lab-move-name">${take.key}</strong></div>
        <dl>
          <div><dt>Startup</dt><dd>${take.startup}f</dd></div>
          <div><dt>Active</dt><dd>${take.active}f</dd></div>
          <div><dt>Recovery</dt><dd>${take.recovery}f</dd></div>
          <div><dt>Total</dt><dd>${take.duration}f</dd></div>
        </dl>
      </header>
      <div class="lab-rows">
        ${row("Frame", cells.frame)}${row("Phase", cells.phase)}${row("Hit", cells.hit)}${row("Cancel", cells.cancel)}
        <div class="lab-track"><i class="lab-playhead"></i></div>
      </div>
    </div>`;
}

function hexframeMoveData() {
  const range = ([start, end]) => start === end ? String(start + 1) : `${start + 1}–${end + 1}`;
  const rows = LAB_TAKES.map((take) => {
    const activeStart = take.startup + 1;
    const activeEnd = take.startup + take.active;
    const recoveryStart = activeEnd + 1;
    return `<tr><th scope="row">${escapeHtml(take.key)}</th><td>1–${take.startup}</td><td>${activeStart}–${activeEnd}</td><td>${recoveryStart}–${take.duration}</td><td>${range(take.hit)}</td><td>${range(take.cancel)}</td><td>${take.damage}</td><td>${take.pushback}</td></tr>`;
  }).join("");
  return `<div class="sr-only"><table id="hexframe-move-data"><caption>Hexframe move data represented by the animated timeline</caption><thead><tr><th scope="col">Move</th><th scope="col">Startup frames</th><th scope="col">Active frames</th><th scope="col">Recovery frames</th><th scope="col">Hit frames</th><th scope="col">Cancel frames</th><th scope="col">Damage</th><th scope="col">Pushback</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function hexframeVisual() {
  return `<div class="preview-with-data"><div class="project-visual lab-preview" role="img" aria-label="Hexframe training mode: two authored attacks deal 30 and 20 damage, produce impact sparks, reduce the dummy's health, and push the dummy backward in sync with the move timeline" aria-describedby="hexframe-move-data">
    <header class="lab-brand">
      <p class="lab-eyebrow">Hexframe / Training</p>
      <strong>Prime. Link. Cash out.</strong>
      <p class="lab-sub">Build a sixteen-technique arsenal. Route statuses. Finish the fight.</p>
    </header>
    <div class="lab-stage">
      <div class="lab-hud">
        <div class="lab-player"><span>You</span><div class="lab-meters"><div class="lab-hp"><i class="lab-hp-p1"></i></div><div class="lab-sta"><i></i></div></div><strong><b>1050</b><small>100 stamina</small></strong></div>
        <div class="lab-player lab-player-right"><strong><b class="lab-health-readout"><i class="lab-health-number lab-health-1000">1000</i><i class="lab-health-number lab-health-970">970</i><i class="lab-health-number lab-health-950">950</i></b><small>100 stamina</small></strong><div class="lab-meters"><div class="lab-hp"><i class="lab-hp-p2"></i></div><div class="lab-sta"><i></i></div></div><span>Dummy</span></div>
      </div>
      <svg viewBox="-150 -125 300 158" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <rect x="-400" y="-125" width="800" height="158" fill="#080a0f"/>
        <rect x="-400" y="0" width="800" height="33" fill="#121219"/>
        <line x1="0" y1="-125" x2="0" y2="33" stroke="#21262d" stroke-width="1" stroke-dasharray="4 8"/>
        <line x1="-400" y1="0" x2="400" y2="0" stroke="#484f58" stroke-width="2"/>
        ${LAB_TAKES.map(labTake).join("")}
      </svg>
      <div class="lab-legend"><span class="lab-key lab-key-hurt">Hurtbox</span><span class="lab-key lab-key-hit">Hitbox</span></div>
      ${LAB_TAKES.map((take) => `<div class="lab-take lab-take-${take.id} lab-route"><span>Hit confirmed</span><strong>${take.key}</strong><em>${take.damage} damage · ${take.pushback} pushback · ${take.active} frames active</em></div>`).join("")}
    </div>
    ${LAB_TAKES.map(labTimeline).join("")}
  </div>${hexframeMoveData()}</div>`;
}

// The library shelf uses YarReader's own interface language with original, title-free demo
// artwork kept blurred and darkened behind sharp metadata. Every title and count is a
// synthetic fixture; runtime catalog data and publisher-owned cover art never enter here.
const YAR_SERIES = [
  { name: "Violet Orbit", units: 12, meta: "Comic · 0001 – 0012" },
  { name: "Nocturne City", units: 8, meta: "Comic · 0001 – 0008" },
  { name: "Iron Pilgrim", units: 16, meta: "Manga · 0001 – 0016" },
  { name: "The Amber Reach", units: 6, meta: "Comic · 0001 – 0006" },
  { name: "Below the Line", units: 10, meta: "Webtoon · 0001 – 0010" },
  { name: "Verdant Passage", units: 14, meta: "Manga · 0001 – 0014" }
];

function yarReaderVisual() {
  const cards = YAR_SERIES.map((series, index) => `<article class="yar-card">
      <div class="yar-art yar-art-${index}" role="img" aria-label="Original fictional cover art for ${escapeHtml(series.name)}"><i>${series.units}</i></div>
      <div class="yar-body"><span>${series.name}</span><strong>${series.units} units</strong><em>${series.meta}</em></div>
    </article>`).join("");
  return `<div class="project-visual yar-preview" data-fixture="synthetic" aria-label="YarReader sample library with original fictional comics, manga and webtoons, a search field, filters, and per-series unit counts and chapter ranges">
    <div class="yar-head">
      <div class="yar-id"><strong>YarReader</strong><span>6 fictional series · 66 chapters · Original demo artwork</span></div>
      <div class="yar-search">Search series, title, year</div>
      <div class="yar-select">Alphabetical</div>
    </div>
    <div class="yar-filters">
      <span class="yar-label">Format</span>
      <span class="yar-pill yar-pill-on">All formats</span>
      <span class="yar-pill">Manga (RTL)</span>
      <span class="yar-pill">Comics (LTR)</span>
      <span class="yar-pill">Webtoons (Scroll)</span>
      <span class="yar-label yar-label-genre">Genre</span>
      <span class="yar-select yar-select-small">All genres</span>
    </div>
    <div class="yar-scope">
      <span class="yar-pill yar-pill-on">Series</span>
      <span class="yar-pill">Chapters</span>
      <em>6 sample series</em>
    </div>
    <div class="yar-grid">${cards}</div>
  </div>`;
}

function projectVisual(project) {
  if (project.slug === "sharktank") return sharkTankVisual();
  if (project.slug === "hexframe") return hexframeVisual();
  return yarReaderVisual();
}

function projectCardActions(project) {
  const play = project.liveUrl ? `<a class="text-link" href="${project.liveUrl}" aria-label="Play ${escapeHtml(project.name)}">Play <span aria-hidden="true">↗</span></a>` : "";
  const caseStudy = `<a class="text-link" href="/projects/${project.slug}/case-study/" aria-label="Read the ${escapeHtml(project.name)} case study">Case study <span aria-hidden="true">→</span></a>`;
  const github = `<a class="text-link" href="${project.sourceUrl}" aria-label="View ${escapeHtml(project.name)} source code on GitHub">GitHub <span aria-hidden="true">↗</span></a>`;
  return `<div class="project-card-actions">${play}${caseStudy}${github}</div>`;
}

function projectCard(project) {
  return `<article class="project-card">
    <div class="project-card-visual" aria-hidden="true" inert>${projectVisual(project)}</div>
    <div class="project-card-copy"><span class="project-number">${project.number} / ${escapeHtml(project.eyebrow)}</span><h3><a href="/projects/${project.slug}/">${escapeHtml(project.name)}</a></h3><p>${escapeHtml(project.description)}</p>${projectCardActions(project)}</div>
  </article>`;
}

function selectedWork() {
  return `<div class="selected-work-grid">${professionalRoles.map((role) => `<article><span>${escapeHtml(role.dates)}</span><h3>${escapeHtml(role.organization)}</h3><strong>${escapeHtml(role.role)}</strong><p>${escapeHtml(role.summary)}</p></article>`).join("")}</div>`;
}

function capabilityGrid() {
  const items = [
    ["01", "Build the software", "I turn requirements into applications, APIs, data tools, and automation."],
    ["02", "Connect the systems", "I make business systems share the right data at the right time."],
    ["03", "Put it into use", "I move data, configure workflows, test, train users, and support launch."],
    ["04", "Lead the work", "I keep scope, owners, risks, and releases clear."],
    ["05", "Keep it running", "I monitor production, respond to incidents, improve recovery, and document changes."]
  ];
  return `<div class="capability-grid">${items.map(([number, title, copy]) => `<article><small>${number}</small><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div>`;
}

function home(build) {
  const body = `<main class="site-main" id="main" tabindex="-1">
    <section class="hero jacob-hero"><div class="hero-identity"><h1>Jacob <span>Yongue</span></h1><p class="kicker hero-role">Software engineer · Systems · Project delivery</p><div class="home-statement-card"><p>I build systems that ship.</p></div></div><div class="hero-side"><p>I design, build, connect, and launch software, then help teams keep it working in production.</p><div class="button-row"><a class="button button-primary" href="/projects/">View projects</a><a class="button" href="mailto:${CONTACT_EMAIL}">Get in touch</a></div></div></section>
    <section class="portfolio-section selected-projects" aria-labelledby="selected-projects-heading"><div class="section-heading"><div><p class="kicker">Selected projects</p><h2 id="selected-projects-heading">Independent systems, shipped.</h2></div><a class="text-link" href="/projects/">All projects <span aria-hidden="true">→</span></a></div><div class="project-card-grid">${projects.map(projectCard).join("")}</div></section>
    <section class="portfolio-section selected-work" aria-labelledby="selected-work-heading"><div class="section-heading"><div><p class="kicker">Selected work</p><h2 id="selected-work-heading">Systems delivered in real operations.</h2></div><a class="text-link" href="/work/">Professional portfolio <span aria-hidden="true">→</span></a></div>${selectedWork()}</section>
    <section class="portfolio-section capabilities" aria-labelledby="capabilities-heading"><div class="section-heading"><div><p class="kicker">Capabilities</p><h2 id="capabilities-heading">From idea to production.</h2></div></div>${capabilityGrid()}</section>
    <section class="about-teaser" aria-labelledby="about-teaser-heading"><div><p class="kicker">About</p><h2 id="about-teaser-heading">Practical systems. Full ownership.</h2></div><div><p>I’m a software engineer and implementation lead who works comfortably across code, operations, and delivery. I learn unfamiliar domains quickly, make system boundaries explicit, and stay with the work through production.</p><a class="text-link" href="/about/">About Jacob <span aria-hidden="true">→</span></a></div></section>
    <section class="contact-band" aria-label="Contact"><p>Need someone who can move from requirements to a working system?</p><div class="button-row"><a class="button button-primary" href="mailto:${CONTACT_EMAIL}">Get in touch</a><a class="button" href="/work/">Professional work</a></div></section>
  </main>`;
  return document({ title: "Jacob Yongue — Software Engineer | WizardGang", description: "Jacob Yongue designs, builds, integrates, and delivers software systems from requirements through production. Explore projects, professional work, and technical case studies.", path: "/", body, build, social: true });
}

function projectsIndex(build) {
  const body = `<main class="case-main" id="main" tabindex="-1"><section class="page-hero"><p class="kicker">Projects</p><h1>Built to be<br><span>inspected.</span></h1><p>Independent software projects with a clear path from concise overview to technical case study, running application, and source evidence.</p></section><section class="projects-index" aria-label="Personal engineering projects"><div class="project-card-grid">${projects.map(projectCard).join("")}</div></section></main>`;
  return document({ title: "Projects — Jacob Yongue", description: "Personal engineering projects by Jacob Yongue: SharkTank, Hexframe, and YarReader, with technical case studies and live proof.", path: "/projects/", current: "projects", body, build });
}

function work(build) {
  const body = `<main class="case-main professional-main" id="main" tabindex="-1">
    <section class="professional-hero"><div><p class="kicker">Work / professional portfolio</p><h1>Production work.<br><span>Operational stakes.</span></h1></div><div class="professional-hero-copy"><p>AI, supply-chain, fulfillment, and public-sector systems delivered from discovery through production.</p></div></section>
    <section class="professional-experience" aria-labelledby="experience-heading"><div class="professional-section-heading"><div><p class="kicker">Career history</p><h2 id="experience-heading">Roles across the delivery path.</h2></div><p>What I owned, what I delivered, and the operating context around each role.</p></div><div class="experience-grid">${professionalRoles.map((item) => `<article><span>${escapeHtml(item.dates)}</span><h3>${escapeHtml(item.organization)}</h3><strong>${escapeHtml(item.role)}</strong><p>${escapeHtml(item.summary)}</p></article>`).join("")}</div></section>
    <section class="systems-resume-section" aria-labelledby="work-systems"><header><div><p class="kicker">Systems delivered</p><h2 id="work-systems">Real systems in real operations.</h2></div><p>Systems organized by what they do.</p></header><div class="systems-resume-grid">${systemGroups.map((group) => `<article class="proof-group"><h3>${escapeHtml(group.title)}</h3>${capabilityList(group.items)}</article>`).join("")}</div></section>
    <section class="systems-resume-section" aria-labelledby="work-integrations"><header><div><p class="kicker">Integrations</p><h2 id="work-integrations">Connected business operations.</h2></div><p>Enterprise, warehouse, logistics, commerce, development, and automation platforms integrated into production workflows.</p></header><div class="systems-resume-grid">${referenceGroups(integrationGroups)}</div></section>
    <section class="systems-resume-section" aria-labelledby="work-deployments"><header><div><p class="kicker">Deployments</p><h2 id="work-deployments">Organizations and environments.</h2></div><p>Organization links are provided for identification only.</p></header>${referenceList(deployments)}</section>
    <section class="professional-skills" aria-labelledby="skills-heading"><div class="professional-section-heading"><div><p class="kicker">Core skills</p><h2 id="skills-heading">The delivery stack.</h2></div><p>The languages, platforms, and practices behind this professional record.</p></div><div class="skill-columns">${professionalSkills.map((group) => `<div><strong>${escapeHtml(group.label)}</strong>${tags(group.items, group.label)}</div>`).join("")}</div></section>
    <p class="logo-disclaimer">Company and product marks are shown only to identify project context. All marks remain the property of their respective owners; no endorsement is implied.</p>
  </main>`;
  return document({ title: "Work — Jacob Yongue | Professional Portfolio", description: "Jacob Yongue's professional portfolio: systems delivered, deployments, integrations, career history, QA, implementation, and production support from 2019 through 2026.", path: "/work/", current: "work", body, build });
}

function services(build) {
  const packageCards = WEBSITE_PACKAGES.map((item, index) => `<article class="service-package${index === 2 ? " service-package-featured" : ""}"><header><span>${String(index + 1).padStart(2, "0")} / ${escapeHtml(item.name)}</span><strong>${escapeHtml(item.price)}</strong></header><h3>${escapeHtml(item.pages)}</h3><p>${escapeHtml(item.description)}</p><ul>${item.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul></article>`).join("");
  const body = `<main class="case-main services-main" id="main" tabindex="-1">
    <section class="services-hero"><div><p class="kicker">Services / small-business websites</p><h1><span class="services-hero-line-primary">Launch the site.</span><span>Keep the keys.</span></h1></div><div class="services-hero-copy"><p>I don’t sell you a website subscription. I build you a small piece of software and hand you the keys.</p><div class="button-row"><a class="button button-primary" href="mailto:${CONTACT_EMAIL}?subject=Website%20package%20inquiry">Start a project</a></div></div></section>
    <section class="service-packages" aria-labelledby="packages-heading"><header><div><p class="kicker">Website packages</p><h2 id="packages-heading">Choose the scope that fits.</h2></div><p>Each package uses the same responsive, config-driven foundation. The difference is how many routes and customer-facing features the site includes.</p></header><div class="service-package-grid">${packageCards}</div></section>
    <section class="service-ownership" aria-labelledby="ownership-heading"><header><div><p class="kicker">Ownership</p><h2 id="ownership-heading">The website is yours.</h2></div><p>Most website builders keep the system behind your site. This approach gives you a real software project that you can see, own, and move.</p></header><p class="service-statement">Your website. Your code. Your infrastructure.</p><div class="service-stack" role="list" aria-label="Website ownership and deployment path"><article role="listitem"><span>01</span><h3>GitHub</h3><p>Your source code, site configuration, content, and change history live in a repository you control.</p></article><article role="listitem"><span>02</span><h3>Cloudflare</h3><p>Cloudflare builds and delivers the site, handles HTTPS, and connects it to the internet from infrastructure you control.</p></article><article role="listitem"><span>03</span><h3>Your domain</h3><p>Your business address points directly to your deployment. I do not have to stay in the middle.</p></article></div><aside class="service-cost"><div><p class="kicker">A small system first</p><h3>No required monthly hosting subscription for qualifying sites.</h3></div><div><p>For qualifying small-business sites, production infrastructure can run on the free tiers of GitHub and Cloudflare. Cloudflare currently includes 100,000 Worker requests per day on its free plan, and static asset requests are free and unlimited.</p><p>Domain registration, paid add-ons, and usage above current free-tier limits are separate. The point is ownership—not a promise that every site will cost $0 forever.</p><div class="text-links"><a class="text-link" href="https://developers.cloudflare.com/workers/platform/pricing/">Cloudflare limits <span aria-hidden="true">↗</span></a><a class="text-link" href="https://docs.github.com/en/get-started/learning-about-github/githubs-plans">GitHub plans <span aria-hidden="true">↗</span></a></div></div></aside></section>
    <section class="service-handoff" aria-labelledby="handoff-heading"><div><p class="kicker">Handoff</p><h2 id="handoff-heading">Built to be handed over.</h2><p>I can build, configure, test, and launch the site. You receive the pieces another developer—or an AI coding tool—would need to continue the work later.</p></div><ul><li>Source code</li><li>GitHub repository</li><li>Site configuration and content</li><li>Domain and deployment configuration</li><li>Change and deployment history</li><li>Documentation for future work</li></ul></section>
    <section class="service-process" aria-labelledby="process-heading"><header><div><p class="kicker">Delivery</p><h2 id="process-heading">From business details to a working site.</h2></div><p>You provide the business information, brand direction, approved copy, images, and domain access. I configure, test, deploy, and hand over the working site.</p></header><div class="service-process-grid"><article><span>01</span><h3>Define the site</h3><p>Confirm the package, pages, content, visual direction, and contact path.</p></article><article><span>02</span><h3>Build and check</h3><p>Configure the site, test its routes and forms, and prepare the production domain.</p></article><article><span>03</span><h3>Deploy and hand over</h3><p>Publish the site and leave the source, configuration, and deployment under your control.</p></article></div></section>
    <section class="service-growth" aria-labelledby="growth-heading"><div><p class="kicker">Start small, grow for a reason</p><h2 id="growth-heading">Add infrastructure when the business needs it.</h2></div><ol><li><span>01</span><strong>Buy</strong><small>A fixed-scope site</small></li><li><span>02</span><strong>Own</strong><small>Code, domain, deployment</small></li><li><span>03</span><strong>Understand</strong><small>A visible source of truth</small></li><li><span>04</span><strong>Verify</strong><small>History and checks</small></li><li><span>05</span><strong>Grow</strong><small>Forms, data, booking, or automation</small></li></ol></section>
    <section class="service-notes"><div><p class="kicker">Scope</p><h2>Clear package boundaries.</h2></div><p>Domain purchases, paid third-party services, custom application features, ecommerce, and large copy or content migrations are quoted separately before work begins.</p></section>
    <section class="contact-band" aria-label="Website service contact"><p>Ready to own the website you pay for?</p><div class="button-row"><a class="button button-primary" href="mailto:${CONTACT_EMAIL}?subject=Website%20package%20inquiry">Get in touch</a></div></section>
  </main>`;
  return document({ title: "Website Services — Jacob Yongue | WizardGang", description: "Fixed-scope small-business websites with owner-controlled source code, GitHub repository, Cloudflare deployment, domain, and documented handoff.", path: "/services/", current: "services", body, build });
}

function architecture(items) {
  return `<div class="architecture">${items.map(([name, detail]) => `<div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(detail)}</span></div>`).join("")}</div>`;
}

const projectNarrative = {
  sharktank: {
    tagline: "A multiplayer shark game built entirely with AI-generated code.",
    what: "Players swim through a shared tank, eat food, dash forward, fire rockets, and compete for score. The live game also includes security checks, billable-action limits, status monitoring, backups, recovery tools, and public operating records.",
    why: "Realtime gameplay uses cloud resources that cost money, accepts public input, and changes over time. Shark Tank was built to handle those everyday operating needs from the start while also governing a codebase produced entirely by AI.",
    highlights: ["Realtime multiplayer shark gameplay", "A codebase written entirely by AI", "ISO/IEC 27001-aligned security and operating controls", "ISO/IEC 42001-aligned management of AI development", "Metered billable actions with a hard spending limit"]
  },
  hexframe: {
    tagline: "Fighting-game systems made deterministic and inspectable.",
    what: "A browser-based fighting-game system and engineering laboratory built around fixed-step combat, authored frame data, replayable state, rollback-ready boundaries, keyboard and gamepad parity, semantic menus, and accessible training tools.",
    why: "Fighting games compress hard engineering problems into a visible system: timing, input, simulation authority, animation, collision, debugging, accessibility, and tools all have to agree on what happened.",
    highlights: ["A playable stage with a practice dummy", "Pause-on-contact and frame-by-frame controls", "Hitbox, hurtbox, pushbox, and state inspection", "Saved positions and repeatable scenario replays", "Keyboard, gamepad, and accessible display settings"]
  },
  yarreader: {
    tagline: "A portable media library that works without a server.",
    what: "A browser-based reading experience backed by a crash-recoverable pipeline that converts mixed publication formats into a verified, self-contained offline library.",
    why: "Portable archives fail when readers depend on a database, a network, or fragile application state. YarReader pushes complexity into the build pipeline so the activated library stays ordinary, durable, and movable.",
    highlights: ["CBZ, CBR, EPUB, PDF, and image adapters", "Content-addressed normalization", "Crash-recoverable transactions", "Immutable static exports with an offline reader"]
  }
};

function projectShowcase(project, build) {
  const copy = projectNarrative[project.slug];
  const playAction = project.liveUrl ? `<a class="button button-primary" href="${project.liveUrl}" aria-label="Play ${escapeHtml(project.name)}">Play <span aria-hidden="true">↗</span></a>` : "";
  const caseStudyAction = `<a class="button${project.liveUrl ? "" : " button-primary"}" href="/projects/${project.slug}/case-study/" aria-label="Read the ${escapeHtml(project.name)} case study">Case study <span aria-hidden="true">→</span></a>`;
  const githubAction = `<a class="button" href="${project.sourceUrl}" aria-label="View ${escapeHtml(project.name)} source code on GitHub">GitHub <span aria-hidden="true">↗</span></a>`;
  const primaryActions = `${playAction}${caseStudyAction}${githubAction}`;
  const body = `<main class="case-main showcase-main" id="main" tabindex="-1"><a class="crumb" href="/projects/">← Projects</a>
    <section class="showcase-hero"><p class="kicker">${project.number} / ${escapeHtml(project.eyebrow)}</p><h1>${escapeHtml(project.name)}</h1><p>${escapeHtml(copy.tagline)}</p><div class="button-row">${primaryActions}</div></section>
    <div class="case-visual showcase-visual" aria-hidden="true" inert>${projectVisual(project)}</div>
    <section class="showcase-overview"><article><p class="kicker">What it is</p><h2>A complete working system.</h2><p>${escapeHtml(copy.what)}</p></article><article><p class="kicker">Why I built it</p><h2>The engineering question.</h2><p>${escapeHtml(copy.why)}</p></article></section>
    <section class="case-section"><div class="case-label">Engineering highlights</div><div><h2>What the project demonstrates.</h2><ul class="built-list">${copy.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="project-depth"><div><p class="kicker">Go deeper</p><h2>Overview first. Evidence when you want it.</h2></div><div><p>The case study explains the architecture, boundaries, tradeoffs, and current state. The running application and repository provide the proof.</p><div class="button-row">${caseStudyAction}${playAction}${githubAction}</div></div></section>
  </main>`;
  return document({ title: `${project.name} — Project by Jacob Yongue`, description: `${copy.tagline} ${copy.what}`, path: `/projects/${project.slug}/`, current: "projects", body, build });
}

function sharkTankCaseStudy(project, build) {
  const operatingControls = [
    "Public input is checked before the game accepts it",
    "Operator controls are protected and leave a record when they are used",
    "Each release records what changed and how the result was checked",
    "Daily backups are tested by restoring and reading the saved copy",
    "The service reports its current status and calculates uptime from its own records",
    "The service counts billable activity and stops costly actions at a hard limit"
  ];
  const aiDevelopmentControls = [
    "The application code is 100% AI-generated",
    "Policies describe how AI-produced changes are planned, checked, tested, and released",
    "Security, cost, accessibility, recovery, and evidence requirements apply to AI-produced features",
    "Tests and live records check the result instead of trusting generated code because it looks correct",
    "Jacob owns the service, approves its operation, and remains responsible for its results"
  ];
  const accessibilityControls = [
    "Public pages and supported game controls can be used with a keyboard",
    "Visible focus shows where the user is, while clear headings, labels, and skip links make pages easier to navigate",
    "Screen readers announce status changes and errors without moving the user's place",
    "Text and layouts remain readable with browser zoom and stronger contrast",
    "Options include reduced motion, larger text, color labels, captions, and steering help"
  ];
  const body = `<main class="case-main" id="main" tabindex="-1"><a class="crumb" href="/projects/sharktank/">← SharkTank overview</a>
    <section class="case-hero"><div><p class="kicker">${project.number} / ${escapeHtml(project.eyebrow)}</p><h1>${escapeHtml(project.name)}</h1></div><div><p class="case-lede">${escapeHtml(project.description)}</p>${tags(project.tags)}${actions(project)}</div></section>
    <div class="case-visual" aria-hidden="true" inert>${projectVisual(project)}</div>
    <section class="case-section"><div class="case-label">01 — The game</div><div><h2>It starts with multiplayer gameplay.</h2><p>Players control sharks in a shared tank. They eat food, dash forward, fire rockets, and compete for score while the server keeps everyone in the same match. The security and operating features support that game; they are not the game itself.</p></div></section>
    <section class="case-section"><div class="case-label">02 — The operating problem</div><div><h2>A live game uses real resources.</h2><p>${escapeHtml(project.problem)}</p><p>Shark Tank therefore includes the checks needed to run the game responsibly. They protect public input, control operator access, track billable activity, record changes, and provide a recovery path.</p></div></section>
    <section class="case-section"><div class="case-label">03 — ISO/IEC 27001</div><div><h2>Secure operation is built into the game.</h2><p><strong>ISO/IEC 27001</strong> provides principles for managing information security. Shark Tank applies those principles to every feature and to the way the live service is operated: access is controlled, input is checked, changes are tested, backups are verified, and important actions leave records. These are everyday safeguards, not a claim that a security incident has occurred.</p><ul class="built-list">${operatingControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="case-section"><div class="case-label">04 — ISO/IEC 42001</div><div><h2>The AI story is how the game was developed.</h2><p><strong>ISO/IEC 42001</strong> applies here because the codebase was developed entirely with AI-generated code. It guides how that development is managed: what AI is used for, how its output is checked, who remains responsible, and what evidence is kept.</p><ul class="built-list">${aiDevelopmentControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="case-section"><div class="case-label">05 — Owner-run operations</div><div><h2>Controls help the owner run the service.</h2><p>Jacob operates Shark Tank. If a real incident occurs, he reports it, investigates it, resolves it, and closes the record. Built-in checks and status pages help him see what the service is doing and respond when action is needed.</p></div></section>
    <section class="case-section"><div class="case-label">06 — Reliability</div><div><h2>Uptime comes from the service record.</h2><p>The site calculates availability from the records kept since the project started. When those records support it, the page says <strong>100% uptime maintained</strong>. If the record changes, the displayed number changes too.</p></div></section>
    <section class="case-section"><div class="case-label">07 — Billable actions</div><div><h2>Gameplay has a spending limit.</h2><p>Joining a tank, running a live room, steering, dashing, and saving records all use metered cloud resources. The service measures that activity while the game runs. At the hard spending limit, it pauses gameplay and other actions that could add cost. Status, evidence, and recovery pages remain available so Jacob can review the situation before restarting normal play.</p>${architecture([
      ["Normal", "The game, updates, and public records work normally"],
      ["Measure", "The service counts billable activity as it happens"],
      ["Limit reached", "Gameplay and other costly actions pause"],
      ["Review and restart", "Status and recovery stay available to the owner"]
    ])}</div></section>
    <section class="case-section"><div class="case-label">08 — Policies and evidence</div><div><h2>The rules and their results stay together.</h2><p>Shark Tank documents its policies against ISO/IEC 27001 and ISO/IEC 42001. The same service keeps evidence for the controls it operates, including changes, uptime, billable activity, operator actions, backups, and recovery checks. This makes it possible to compare a written policy with what the game actually did.</p>${architecture([
      ["Policy", "State the rule and the ISO requirement it supports"],
      ["Game control", "Build the rule into the service or its operating process"],
      ["Check", "Test that the control behaves as intended"],
      ["Evidence", "Keep the live result or operating record"]
    ])}</div></section>
    <section class="case-section"><div class="case-label">09 — Accessibility</div><div><h2>More people can use the site and its controls.</h2><p><strong>WCAG 2.0 AA</strong> is a common set of web-accessibility rules. Shark Tank's public pages, menus, settings, and supported game controls are tested against those rules. This does not mean every visual action in the game has a matching nonvisual version; the claim covers the listed screens and controls.</p><ul class="built-list">${accessibilityControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="case-section"><div class="case-label">10 — Architecture</div><div><h2>Each service has one job.</h2>${architecture(project.architecture)}<p>The browser shows the game and public records. The Worker checks requests and serves those pages. Durable Objects keep live matches, logs, and operator records. R2 stores separate backup copies for recovery tests.</p></div></section>
    <section class="case-section"><div class="case-label">11 — Result</div><div><h2>A game first, with its controls built in.</h2><p>${escapeHtml(project.result)}</p>${actions(project)}</div></section>
  </main>`;
  return document({
    title: "SharkTank — AI-Developed Multiplayer Game Case Study | WizardGang",
    description: project.description,
    path: "/projects/sharktank/case-study/",
    current: "projects",
    body,
    build
  });
}

function projectCaseStudy(project, build) {
  if (project.slug === "sharktank") return sharkTankCaseStudy(project, build);

  const title = project.slug === "hexframe"
    ? "Hexframe — Deterministic Fighting Game Systems | WizardGang"
    : "YarReader — Portable Media Pipeline | WizardGang";
  const accessibility = project.slug === "hexframe" ? `<section class="case-section"><div class="case-label">05 — Accessibility</div><div><h2>The lab supports different controls and display needs.</h2><p>Hexframe's menus and training tools target <strong>WCAG 2.0 AA</strong>. The lab works with a keyboard or gamepad, always shows which control has focus, and can announce important combat updates to a screen reader. Players can also change text size, contrast, color labels, and motion.</p><ul class="built-list"><li>Keyboard and gamepad controls for the training lab and menus</li><li>Clear focus when moving through buttons, tabs, and dialogs</li><li>Larger text, stronger contrast, and color-vision settings</li><li>Reduced motion and reduced combat flashes</li><li>Screen-reader messages for important status and combat changes</li></ul><p>The claim covers these menus, tools, settings, and supported controls. It does not claim a complete nonvisual replacement for the spatial fight itself.</p></div></section>` : "";
  const resultNumber = project.slug === "hexframe" ? "06" : "05";
  const engineeringHeading = project.slug === "hexframe"
    ? "Graphics show the fight; game rules decide it."
    : "Do the hard work before the reader opens.";
  const resultHeading = project.slug === "hexframe"
    ? "A playable foundation that can grow."
    : "A library that can recover and be rebuilt.";
  const body = `<main class="case-main" id="main" tabindex="-1"><a class="crumb" href="/projects/${project.slug}/">← ${escapeHtml(project.name)} overview</a>
    <section class="case-hero"><div><p class="kicker">${project.number} / ${escapeHtml(project.eyebrow)}</p><h1>${escapeHtml(project.name)}</h1></div><div><p class="case-lede">${escapeHtml(project.description)}</p>${tags(project.tags)}${actions(project)}</div></section>
    <div class="case-visual" aria-hidden="true" inert>${projectVisual(project)}</div>
    <section class="case-section"><div class="case-label">01 — Problem</div><div><h2>${project.slug === "hexframe" ? "Make every feature agree on what happened." : "Protect the library while rebuilding it."}</h2><p>${escapeHtml(project.problem)}</p></div></section>
    <section class="case-section"><div class="case-label">02 — What I built</div><div><h2>What the project does.</h2><ul class="built-list">${project.built.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="case-section"><div class="case-label">03 — Architecture</div><div><h2>Each part has one job.</h2>${architecture(project.architecture)}</div></section>
    <section class="case-section"><div class="case-label">04 — Key design choice</div><div><h2>${engineeringHeading}</h2><p>${escapeHtml(project.engineering)}</p></div></section>
    ${accessibility}
    <section class="case-section"><div class="case-label">${resultNumber} — What works today</div><div><h2>${resultHeading}</h2><p>${escapeHtml(project.result)}</p>${actions(project)}</div></section>
  </main>`;
  return document({ title, description: project.description, path: `/projects/${project.slug}/case-study/`, current: "projects", body, build });
}

function about(build) {
  const body = `<main class="case-main about-main" id="main" tabindex="-1"><section class="page-hero about-hero"><p class="kicker">About Jacob Yongue</p><h1>Build the whole path.<br><span>Own the outcome.</span></h1><div class="prose"><p>I’m a software engineer with an implementation background and a systems view of delivery. My work spans requirements, architecture, application development, integrations, QA, deployment, training, operational handoff, and production support.</p><p>I’m most useful when the problem crosses boundaries: code and workflow, product and operations, technical design and project delivery. I make those boundaries explicit, learn the unfamiliar parts quickly, and keep evidence close enough that another person can understand what the system actually does.</p></div></section>
    <section class="about-principles" aria-labelledby="approach-heading"><div><p class="kicker">Approach</p><h2 id="approach-heading">Practical systems over isolated artifacts.</h2></div><div class="principle-grid"><article><span>01</span><h3>Systems thinking</h3><p>Model the workflow, failure modes, ownership, and operating environment before optimizing an isolated component.</p></article><article><span>02</span><h3>Implementation depth</h3><p>Stay hands-on through the code, integration, testing, deployment, adoption, and the edge cases production reveals.</p></article><article><span>03</span><h3>Project ownership</h3><p>Make scope, risk, decisions, and handoff legible so progress survives team and technology boundaries.</p></article><article><span>04</span><h3>Learning velocity</h3><p>Reduce unfamiliar technology to explicit contracts, inspectable behavior, and small verifiable steps.</p></article></div></section>
  </main>`;
  return document({ title: "About Jacob Yongue — Software Engineer", description: "About Jacob Yongue: software engineer, implementation lead, systems thinker, and project owner focused on practical systems from requirements through production.", path: "/about/", current: "about", body, build });
}

function officialReference(item) {
  if (!item.url) return escapeHtml(item.name);
  return `<a href="${escapeHtml(item.url)}">${escapeHtml(item.name)}</a>`;
}

function referenceList(items) {
  return `<ul class="reference-cloud">${items.map((item) => `<li>${officialReference(item)}</li>`).join("")}</ul>`;
}

function referenceGroups(groups, limit) {
  return groups.map((group) => {
    const items = Number.isInteger(limit) ? group.items.slice(0, limit) : group.items;
    return `<article class="proof-group"><h3>${escapeHtml(group.title)}</h3>${referenceList(items)}</article>`;
  }).join("");
}

function capabilityList(items) {
  return `<ul class="capability-cloud">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

const WCAG_LEVELS = [
  {
    level: "A",
    criteria: [
      ["1.1.1", "Non-text Content", "Decorative project previews are excluded from the accessibility tree; adjacent project names and descriptions provide the useful content.", "met"],
      ["1.2.1", "Audio-only and Video-only (Prerecorded)", "The portfolio publishes no prerecorded audio-only or video-only media.", "met"],
      ["1.2.2", "Captions (Prerecorded)", "The portfolio publishes no prerecorded synchronized media that requires captions.", "met"],
      ["1.2.3", "Audio Description or Media Alternative", "The portfolio publishes no prerecorded synchronized video requiring an alternative.", "met"],
      ["1.3.1", "Info and Relationships", "Headings, landmarks, lists, tables, labels, and groups express the page structure.", "met"],
      ["1.3.2", "Meaningful Sequence", "The source order preserves the intended reading and interaction sequence.", "met"],
      ["1.3.3", "Sensory Characteristics", "Instructions and controls do not depend only on shape, position, or sound.", "met"],
      ["1.4.1", "Use of Color", "Labels, text, patterns, and symbols accompany color-coded states.", "met"],
      ["1.4.2", "Audio Control", "No audio starts automatically.", "met"],
      ["2.1.1", "Keyboard", "Navigation, preferences, disclosures, and links use native keyboard-operable controls.", "met"],
      ["2.1.2", "No Keyboard Trap", "No component traps keyboard focus.", "met"],
      ["2.1.4", "Character Key Shortcuts", "The portfolio defines no single-character keyboard shortcuts.", "met"],
      ["2.2.1", "Timing Adjustable", "The portfolio sets no time limits for reading or interaction.", "met"],
      ["2.2.2", "Pause, Stop, Hide", "Project previews play by default; pause them with the Play previews control.", "met"],
      ["2.3.1", "Three Flashes or Below Threshold", "Preview motion stays below the three-flashes threshold.", "met"],
      ["2.4.1", "Bypass Blocks", "Every page starts with a keyboard-visible skip link to main content.", "met"],
      ["2.4.2", "Page Titled", "Every route has a descriptive page title.", "met"],
      ["2.4.3", "Focus Order", "Keyboard focus follows the document and visual sequence.", "met"],
      ["2.4.4", "Link Purpose (In Context)", "Links have clear visible context and descriptive accessible names.", "met"],
      ["2.5.1", "Pointer Gestures", "The portfolio requires no multipoint or path-based pointer gestures.", "met"],
      ["2.5.2", "Pointer Cancellation", "Links and controls use native activation behavior rather than custom down-event actions.", "met"],
      ["2.5.3", "Label in Name", "Visible control and link labels are included in their accessible names.", "met"],
      ["2.5.4", "Motion Actuation", "No function requires device movement or user motion.", "met"],
      ["3.1.1", "Language of Page", "The document language is English by default and changes to Spanish with the language preference.", "met"],
      ["3.2.1", "On Focus", "Moving focus does not trigger navigation or unexpected changes.", "met"],
      ["3.2.2", "On Input", "Preference changes are immediate, reversible, and match their labels.", "met"],
      ["3.2.6", "Consistent Help", "Contact help remains in consistent primary-navigation and footer locations.", "met"],
      ["3.3.1", "Error Identification", "The portfolio has no data-entry forms; native controls expose their state.", "met"],
      ["3.3.2", "Labels or Instructions", "All preference controls have visible labels and grouped legends.", "met"],
      ["3.3.7", "Redundant Entry", "The portfolio does not ask visitors to enter information more than once.", "met"],
      ["4.1.2", "Name, Role, Value", "Native controls and descriptive link names expose role, state, and purpose.", "met"]
    ]
  },
  {
    level: "AA",
    criteria: [
      ["1.2.4", "Captions (Live)", "The portfolio publishes no live synchronized media.", "met"],
      ["1.2.5", "Audio Description (Prerecorded)", "The portfolio publishes no prerecorded video requiring audio description.", "met"],
      ["1.3.4", "Orientation", "Layouts work in portrait and landscape without locking the viewport orientation.", "met"],
      ["1.3.5", "Identify Input Purpose", "The portfolio does not collect personal information through input fields.", "met"],
      ["1.4.3", "Contrast (Minimum)", "Text contrast is tested above the Level AA thresholds in both themes.", "met"],
      ["1.4.4", "Resize Text", "The 200% text preference reflows without clipped text or horizontal page scrolling.", "met"],
      ["1.4.5", "Images of Text", "Informational text is rendered as HTML rather than embedded in images.", "met"],
      ["1.4.10", "Reflow", "Pages reflow at narrow and zoom-equivalent widths without horizontal page scrolling.", "met"],
      ["1.4.11", "Non-text Contrast", "Control boundaries and focus indicators use design tokens with at least 3:1 contrast.", "met"],
      ["1.4.12", "Text Spacing", "Text remains visible when user spacing overrides are applied.", "met"],
      ["1.4.13", "Content on Hover or Focus", "The portfolio does not reveal essential content only on hover or focus.", "met"],
      ["2.4.5", "Multiple Ways", "Primary navigation, page links, sitemap, and route index provide multiple paths.", "met"],
      ["2.4.6", "Headings and Labels", "Headings and labels describe their section or control.", "met"],
      ["2.4.7", "Focus Visible", "Keyboard focus uses a high-contrast three-pixel outline.", "met"],
      ["2.4.11", "Focus Not Obscured (Minimum)", "Focused controls are not covered by sticky or overlapping interface elements.", "met"],
      ["2.5.7", "Dragging Movements", "No function requires dragging; native scrolling remains available.", "met"],
      ["2.5.8", "Target Size (Minimum)", "Interactive controls meet a 44-pixel design target where practical and otherwise exceed the 24-pixel minimum or spacing exception.", "met"],
      ["3.1.2", "Language of Parts", "Spanish mode translates shared and core content, but remaining English technical passages still need explicit language marking.", "partial"],
      ["3.2.3", "Consistent Navigation", "Shared navigation appears in the same relative order on every page.", "met"],
      ["3.2.4", "Consistent Identification", "Repeated controls and destinations use consistent names and presentation.", "met"],
      ["3.3.3", "Error Suggestion", "The portfolio does not collect user-entered data or produce correctable submission errors.", "met"],
      ["3.3.4", "Error Prevention (Legal, Financial, Data)", "The portfolio performs no legal, financial, or stored-data submissions.", "met"],
      ["3.3.8", "Accessible Authentication (Minimum)", "The portfolio has no authentication flow or cognitive-function test.", "met"],
      ["4.1.3", "Status Messages", "The portfolio does not present dynamic status messages that require assistive-technology announcements.", "met"]
    ]
  }
];

const WCAG_CLAUSE_IDS = {
  "1.1.1": "non-text-content",
  "1.2.1": "audio-only-and-video-only-prerecorded",
  "1.2.2": "captions-prerecorded",
  "1.2.3": "audio-description-or-media-alternative-prerecorded",
  "1.2.4": "captions-live",
  "1.2.5": "audio-description-prerecorded",
  "1.3.1": "info-and-relationships",
  "1.3.2": "meaningful-sequence",
  "1.3.3": "sensory-characteristics",
  "1.3.4": "orientation",
  "1.3.5": "identify-input-purpose",
  "1.4.1": "use-of-color",
  "1.4.2": "audio-control",
  "1.4.3": "contrast-minimum",
  "1.4.4": "resize-text",
  "1.4.5": "images-of-text",
  "1.4.10": "reflow",
  "1.4.11": "non-text-contrast",
  "1.4.12": "text-spacing",
  "1.4.13": "content-on-hover-or-focus",
  "2.1.1": "keyboard",
  "2.1.2": "no-keyboard-trap",
  "2.1.4": "character-key-shortcuts",
  "2.2.1": "timing-adjustable",
  "2.2.2": "pause-stop-hide",
  "2.3.1": "three-flashes-or-below-threshold",
  "2.4.1": "bypass-blocks",
  "2.4.2": "page-titled",
  "2.4.3": "focus-order",
  "2.4.4": "link-purpose-in-context",
  "2.4.5": "multiple-ways",
  "2.4.6": "headings-and-labels",
  "2.4.7": "focus-visible",
  "2.4.11": "focus-not-obscured-minimum",
  "2.5.1": "pointer-gestures",
  "2.5.2": "pointer-cancellation",
  "2.5.3": "label-in-name",
  "2.5.4": "motion-actuation",
  "2.5.7": "dragging-movements",
  "2.5.8": "target-size-minimum",
  "3.1.1": "language-of-page",
  "3.1.2": "language-of-parts",
  "3.2.1": "on-focus",
  "3.2.2": "on-input",
  "3.2.3": "consistent-navigation",
  "3.2.4": "consistent-identification",
  "3.2.6": "consistent-help",
  "3.3.1": "error-identification",
  "3.3.2": "labels-or-instructions",
  "3.3.3": "error-suggestion",
  "3.3.4": "error-prevention-legal-financial-data",
  "3.3.7": "redundant-entry",
  "3.3.8": "accessible-authentication-minimum",
  "4.1.2": "name-role-value",
  "4.1.3": "status-messages"
};

const PUBLIC_COMPLIANCE_DOC = "https://github.com/Wizard-Gang/WizardGang/blob/main/docs/COMPLIANCE.md";

const ISO_STANDARDS = [
  {
    id: "iso-27001",
    area: "Information security",
    name: "ISO/IEC 27001:2022",
    url: "https://www.iso.org/standard/27001",
    criteria: [
      ["4", "Context of the organization", "Scope, interested parties, system boundaries, and the information-security management system are publicly documented.", "met", `${PUBLIC_COMPLIANCE_DOC}#iso-27001-clause-4`],
      ["5", "Leadership", "Ownership, policy, roles, and release accountability are assigned to Jacob Yongue.", "met", `${PUBLIC_COMPLIANCE_DOC}#iso-27001-clause-5`],
      ["6", "Planning", "Security risks, treatment decisions, objectives, and applicable controls are recorded in the public compliance documentation.", "met", `${PUBLIC_COMPLIANCE_DOC}#iso-27001-clause-6`],
      ["7", "Support", "Resources, communication, and document control are defined; recurring competence-review evidence remains incomplete.", "partial", `${PUBLIC_COMPLIANCE_DOC}#iso-27001-clause-7`],
      ["8", "Operation", "Automated checks, staged deployment, change review, reporting, and rollback form the operating process.", "met", `${PUBLIC_COMPLIANCE_DOC}#iso-27001-clause-8`],
      ["9", "Performance evaluation", "Release checks are recorded, but a scheduled internal-audit and management-review history remains incomplete.", "partial", `${PUBLIC_COMPLIANCE_DOC}#iso-27001-clause-9`],
      ["10", "Improvement", "Issues can drive corrective changes, but a formal nonconformity and corrective-action history remains incomplete.", "partial", `${PUBLIC_COMPLIANCE_DOC}#iso-27001-clause-10`],
      ["A", "Statement of applicability", "A portfolio-scoped Annex A applicability record is published and will be updated as the boundary changes.", "partial", `${PUBLIC_COMPLIANCE_DOC}#iso-27001-annex-a`]
    ]
  },
  {
    id: "iso-42001",
    area: "AI management",
    name: "ISO/IEC 42001:2023",
    url: "https://www.iso.org/standard/42001",
    criteria: [
      ["4", "Context of the organization", "AI-development scope, interested parties, intended use, and portfolio boundaries are publicly documented.", "met", `${PUBLIC_COMPLIANCE_DOC}#iso-42001-clause-4`],
      ["5", "Leadership", "Human ownership, AI policy, approval authority, and accountability are assigned to Jacob Yongue.", "met", `${PUBLIC_COMPLIANCE_DOC}#iso-42001-clause-5`],
      ["6", "Planning", "AI risks, impacts, objectives, and treatment decisions are recorded for the portfolio delivery process.", "met", `${PUBLIC_COMPLIANCE_DOC}#iso-42001-clause-6`],
      ["7", "Support", "Source, prompts, tools, build records, and communication paths are defined; recurring competence-review evidence remains incomplete.", "partial", `${PUBLIC_COMPLIANCE_DOC}#iso-42001-clause-7`],
      ["8", "Operation", "Human review, automated verification, development deployment, approval, and rollback govern AI-produced changes.", "met", `${PUBLIC_COMPLIANCE_DOC}#iso-42001-clause-8`],
      ["9", "Performance evaluation", "Build and release results are checked, but a scheduled AI-management audit and review history remains incomplete.", "partial", `${PUBLIC_COMPLIANCE_DOC}#iso-42001-clause-9`],
      ["10", "Improvement", "Defects and feedback lead to revisions, but a formal nonconformity and corrective-action history remains incomplete.", "partial", `${PUBLIC_COMPLIANCE_DOC}#iso-42001-clause-10`],
      ["A", "Reference controls", "A portfolio-scoped AI control applicability record is published and will be updated with material AI-tool changes.", "partial", `${PUBLIC_COMPLIANCE_DOC}#iso-42001-annex-a`]
    ]
  }
];

const GLOSSARY = [
    ["Artificial intelligence (AI)", "Software that can produce or analyze content from learned patterns. On this site, AI mainly describes how code was created or how a work system is used."],
    ["Application programming interface (API)", "A defined way for two software systems to request information or actions from each other."],
    ["Command-line interface (CLI)", "A program controlled by typed commands instead of on-screen buttons."],
    ["Continuous integration and continuous delivery (CI/CD)", "Automated checks and release steps that help teams test and publish software safely."],
    ["Data mapping", "Matching a field in one system, such as an order number, to the corresponding field in another system."],
    ["Deterministic simulation", "A simulation that produces the same result whenever it starts with the same data and actions."],
    ["Electronic data interchange (EDI)", "A standard way for businesses to exchange documents such as orders and shipping notices."],
    ["Enterprise resource planning (ERP)", "Business software used to manage areas such as orders, finance, inventory, and purchasing."],
    ["Extract, transform, and load (ETL)", "A process that reads data, reshapes or checks it, and writes it into another system."],
    ["International Electrotechnical Commission (IEC)", "An organization that develops international standards for electrical, electronic, and related technologies."],
    ["International Organization for Standardization (ISO)", "An organization that publishes international standards for management, technology, safety, and other fields."],
    ["Quality assurance (QA)", "Planned checking used to find problems and confirm that software meets its requirements."],
    ["Rollback architecture", "A game design that can restore an earlier state and calculate the same events again, which helps players stay synchronized online."],
    ["R2 object storage", "A Cloudflare service used to store files and backup copies."],
    ["System monitoring and observability", "Logs, measurements, and status information that help an operator understand what a running system is doing."],
    ["Web Content Accessibility Guidelines (WCAG)", "A published set of testable requirements for making web content more accessible to people with disabilities."],
    ["Warehouse management system (WMS)", "Software used to manage inventory and work inside a warehouse."],
    ["Content addressing", "Identifying a file by a digital fingerprint made from its contents rather than only by its name or location."],
    ["Billable cloud action", "An application action that uses a measured online service and can add to its operating cost."]
];

const statusLabel = (status) => ({ met: "✓ Met", partial: "◐ Partial", gap: "! Gap" })[status];

function statusCounts(criteria) {
  return criteria.reduce((result, criterion) => ({ ...result, [criterion[3]]: result[criterion[3]] + 1 }), { met: 0, partial: 0, gap: 0 });
}

function statusSummary(criteria) {
  const counts = statusCounts(criteria);
  return `<p class="compliance-counts"><span>✓ ${counts.met} met</span><span>◐ ${counts.partial} partial</span><span>! ${counts.gap} gap</span></p>`;
}

function checklistRows(criteria, className) {
  return criteria.map(([number, title, description, status, reference]) => {
    const content = `<span>${number}</span><strong>${escapeHtml(title)}</strong>`;
    const criterion = reference
      ? `<a class="criterion" href="${escapeHtml(reference)}">${content}<span class="sr-only"> — corresponding clause</span></a>`
      : `<div class="criterion">${content}</div>`;
    return `<li class="compliance-item ${className}">${criterion}<p>${escapeHtml(description)}</p><span class="status status-${status}">${statusLabel(status)}</span></li>`;
  }).join("");
}

function complianceLevel({ level, criteria }) {
  const counts = criteria.reduce((result, criterion) => ({ ...result, [criterion[3]]: result[criterion[3]] + 1 }), { met: 0, partial: 0, gap: 0 });
  const referencedCriteria = criteria.map((criterion) => [...criterion, `https://www.w3.org/TR/WCAG22/#${WCAG_CLAUSE_IDS[criterion[0]]}`]);
  return `<section class="compliance-level" aria-labelledby="level-${level.toLowerCase()}"><header><div><p class="kicker">Level ${level}</p><h3 id="level-${level.toLowerCase()}">Level ${level}</h3></div><p class="compliance-counts"><span>✓ ${counts.met} met</span><span>◐ ${counts.partial} partial</span><span>! ${counts.gap} gap</span></p></header><ol class="compliance-list">${checklistRows(referencedCriteria, "wcag-item")}</ol></section>`;
}

function managementStandard({ id, area, name, url, criteria }) {
  return `<section class="compliance-standard compliance-management" aria-labelledby="${id}"><header class="compliance-standard-heading"><div><p class="kicker">${escapeHtml(area)}</p><h2 id="${id}"><a href="${url}">${escapeHtml(name)} <span aria-hidden="true">↗</span></a></h2></div>${statusSummary(criteria)}</header><ol class="compliance-list">${checklistRows(criteria, "iso-item")}</ol></section>`;
}

function compliance(build) {
  const body = `<main class="case-main compliance-main" id="main" tabindex="-1">
    <section class="compliance-heading"><p class="kicker">WizardGang</p><h1>Compliance.</h1><p>AI-developed. Human-reviewed. Public self-assessment—not certification.</p><div class="button-row"><a class="button button-primary" href="mailto:${CONTACT_EMAIL}?subject=WizardGang%20compliance%20report">Report issue</a><a class="button" href="${PUBLIC_COMPLIANCE_DOC}">Public documentation <span aria-hidden="true">↗</span></a></div></section>
    <section class="compliance-standard" aria-labelledby="wcag-2"><header class="compliance-standard-heading"><div><p class="kicker">Accessibility target</p><h2 id="wcag-2"><a href="https://www.w3.org/TR/WCAG22/">WCAG 2.2 AA <span aria-hidden="true">↗</span></a></h2></div><p class="standard-levels">Level A · Level AA</p></header><p class="compliance-scope">This is a route-by-route testing target and public self-assessment, not a certification or blanket conformance claim.</p>${WCAG_LEVELS.map(complianceLevel).join("")}</section>
    ${ISO_STANDARDS.map(managementStandard).join("")}
    <section class="compliance-report" aria-labelledby="compliance-report-heading"><div><p class="kicker">Security + accessibility</p><h2 id="compliance-report-heading">Report an issue.</h2></div><div><p>Email <a href="mailto:${CONTACT_EMAIL}?subject=WizardGang%20compliance%20report">${CONTACT_EMAIL}</a> with the affected address and steps to reproduce it. Do not include passwords, private records, or destructive proof.</p><div class="button-row"><a class="button button-primary" href="mailto:${CONTACT_EMAIL}?subject=WizardGang%20compliance%20report">Report issue</a></div></div></section>
  </main>`;
  return document({ title: "Compliance — WizardGang", description: "WizardGang public self-assessment against WCAG 2.2 Level AA, ISO/IEC 27001:2022, and ISO/IEC 42001:2023 with Met, Partial, and Gap status.", path: "/compliance/", current: "compliance", body, build });
}

function glossary(build) {
  const glossaryMarkup = GLOSSARY.map(([term, definition]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>`).join("");
  const body = `<main class="case-main accessibility-main" id="main" tabindex="-1"><section class="page-hero"><p class="kicker">Glossary</p><h1>Technical terms.<br><span>Clear definitions.</span></h1><p>Definitions for the specialized language used throughout the portfolio.</p></section><section class="accessibility-section" id="glossary" aria-labelledby="glossary-heading"><div><p class="kicker">A–Z</p><h2 id="glossary-heading">Terms used on this site.</h2></div><dl class="glossary-list">${glossaryMarkup}</dl></section></main>`;
  return document({ title: "Glossary — WizardGang", description: "Clear definitions for technical terms and abbreviations used throughout Jacob Yongue's software engineering portfolio.", path: "/glossary/", current: "glossary", body, build });
}

function notFound(build) {
  const body = `<main class="site-main" id="main" tabindex="-1"><section class="not-found"><p class="kicker">404 / Route not found</p><h1>Nothing here.</h1><p>Return to Jacob Yongue’s portfolio or inspect the project index.</p><div class="button-row"><a class="button button-primary" href="/projects/">View projects <span aria-hidden="true">→</span></a><a class="button" href="/">Home</a></div></section></main>`;
  return document({ title: "Not Found — WizardGang", description: "That WizardGang portfolio page does not exist.", path: "/404/", body, build, noindex: true });
}

export function createPages(build) {
  return new Map([
    ["index.html", home(build)],
    ["projects/index.html", projectsIndex(build)],
    ...projects.map((project) => [`projects/${project.slug}/index.html`, projectShowcase(project, build)]),
    ...projects.map((project) => [`projects/${project.slug}/case-study/index.html`, projectCaseStudy(project, build)]),
    ["work/index.html", work(build)],
    ["services/index.html", services(build)],
    ["about/index.html", about(build)],
    ["compliance/index.html", compliance(build)],
    ["glossary/index.html", glossary(build)],
    ["404.html", notFound(build)]
  ]);
}

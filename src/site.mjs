import { projects } from "./projects.mjs";
import { professionalEducation, professionalRoles, professionalSkills } from "./professional.mjs";
import { deployments, integrationGroups, systemGroups } from "./professional-systems.mjs";

const SITE_ORIGIN = "https://wizardgang.ai";
const GITHUB = "https://github.com/Wizard-Gang";
const LINKEDIN = "https://www.linkedin.com/in/jacob-yongue";
const CONTACT_EMAIL = "jacobyongue@outlook.com";

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
    ["about", "/about/", "About"]
  ].map(([key, href, label]) => `<a href="${href}"${current === key ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  const repository = `<a href="${GITHUB}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>`;
  return `<a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <a class="wordmark" href="/" aria-label="Jacob Yongue portfolio home"><span class="wordmark-mark" aria-hidden="true"></span><span class="wordmark-copy"><strong>JACOB YONGUE</strong><small>wizardgang.ai</small></span></a>
      <nav class="site-nav" aria-label="Primary">${nav}${repository}</nav>
    </header>`;
}

function footer(build, current = "") {
  const contact = `<span class="footer-contact"><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></span>`;
  return `<footer class="site-footer"><span>Jacob Yongue · Software engineering portfolio</span>${contact}<span>WizardGang.ai · Build <a href="/version.json">${escapeHtml(build.commit)}</a></span></footer>`;
}

function document({ title, description, path, current, body, build, social = false, noindex = false }) {
  const canonical = `${SITE_ORIGIN}${path}`;
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
    <link rel="stylesheet" href="/assets/styles.css">
  </head>
  <body>
    ${header(current)}
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
    if (project.liveUrl) links.push(`<a class="${compact ? "text-link" : "button button-primary"}" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Play <span aria-hidden="true">↗</span></a>`);
    if (project.operationsUrl) links.push(`<a class="${className}" href="${project.operationsUrl}" target="_blank" rel="noopener noreferrer">Evidence <span aria-hidden="true">↗</span></a>`);
  } else {
    if (project.liveUrl) links.push(`<a class="${compact ? "text-link" : "button button-primary"}" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>`);
    if (project.operationsUrl) links.push(`<a class="${className}" href="${project.operationsUrl}" target="_blank" rel="noopener noreferrer">Operations <span aria-hidden="true">↗</span></a>`);
  }

  links.push(`<a class="${className}" href="${project.sourceUrl}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>`);

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
          <g class="tank-tag"><rect x="386" y="122" width="70" height="21" rx="6" fill="#ffe14d"/><text x="421" y="137">Chowder</text></g>
        </g>
        <g class="tank-fish tank-fish-b">
          <use href="#tankShark" x="196" y="330" width="70" height="43" class="skin-violet"/>
          <g class="tank-tag"><rect x="204" y="303" width="54" height="21" rx="6" fill="#a78bff"/><text x="231" y="318">Molar</text></g>
        </g>
        <g class="tank-fish tank-fish-c">
          <use href="#tankShark" x="424" y="356" width="64" height="39" class="skin-orange"/>
          <g class="tank-tag"><rect x="432" y="330" width="48" height="21" rx="6" fill="#ff8a1f"/><text x="456" y="345">Tide</text></g>
        </g>
        <g class="tank-fish tank-fish-you">
          <g class="tank-dash-trail">
            <circle cx="280" cy="244" r="10" fill="#22e6ff"/>
            <circle cx="258" cy="248" r="7" fill="#fff"/>
            <circle cx="239" cy="241" r="5" fill="#22e6ff"/>
            <circle cx="224" cy="246" r="3.5" fill="#fff"/>
          </g>
          <use href="#tankShark" x="286" y="212" width="106" height="65" class="skin-cyan"/>
          <g class="tank-tag"><rect x="284" y="178" width="110" height="23" rx="6" fill="#22e6ff"/><text x="339" y="194">Player (you)</text></g>
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
      <h4>Top Sharks</h4>
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

const LAB_LOOP = "4.5s";

function labBone(take, name, pivot, parts) {
  const values = take.bones[name];
  const still = take.still[name];
  const spin = values
    ? `<animateTransform attributeName="transform" type="rotate" dur="${LAB_LOOP}" repeatCount="indefinite" values="${values}" keyTimes="${take.keyTimes}"/>`
    : "";
  const held = !values && still !== undefined ? ` transform="rotate(${still})"` : "";
  return `<g transform="translate(${pivot})"><g${held}>${spin}${parts}</g></g>`;
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
  return `<g><animateTransform attributeName="transform" type="translate" dur="${LAB_LOOP}" repeatCount="indefinite" values="${take.pelvis}" keyTimes="${take.keyTimes}"/>${spine}</g>`;
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
      <text class="lab-damage-number" y="-20" text-anchor="middle">${take.damage}</text>
    </g></g>`;
}

// Boxes are authored with y measured up from the feet; the stage draws y downward.
function labBox(x, y, w, h, className) {
  return `<rect class="${className}" x="${x}" y="${-(y + h)}" width="${w}" height="${h}"/>`;
}

function labTake(take) {
  const hurt = take.hurtboxes.map(([x, y, w, h]) => labBox(x, y, w, h, "lab-hurtbox")).join("");
  const { x, y, w, h } = take.hitbox;
  const open = take.hit[0] / take.duration;
  const close = (take.hit[1] + 1) / take.duration;
  const hit = `<g opacity="0"><animate attributeName="opacity" dur="${LAB_LOOP}" repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes="0;${open.toFixed(3)};${close.toFixed(3)}"/>${labBox(x, y, w, h, "lab-hitbox")}</g>`;
  return `<g class="lab-take lab-take-${take.id}" transform="translate(-30 0)">${hurt}<g class="fighter-p1">${labFighter(take)}</g>${hit}${labDummy(take)}</g>`;
}

function labTimeline(take) {
  const cells = { frame: "", phase: "", hit: "", cancel: "" };
  for (let i = 0; i < take.duration; i += 1) {
    const phase = i < take.startup ? "startup" : i < take.startup + take.active ? "active" : "recovery";
    cells.frame += `<span class="lab-cell lab-cell-number">${String(i + 1).padStart(2, "0")}</span>`;
    cells.phase += `<span class="lab-cell lab-on lab-phase-${phase}"></span>`;
    cells.hit += `<span class="lab-cell${i >= take.hit[0] && i <= take.hit[1] ? " lab-cell-hit" : ""}"></span>`;
    cells.cancel += `<span class="lab-cell${i >= take.cancel[0] && i <= take.cancel[1] ? " lab-cell-cancel" : ""}"></span>`;
  }
  const row = (label, body) => `<div class="lab-row"><strong>${label}</strong><div>${body}</div></div>`;
  return `<div class="lab-take lab-take-${take.id} lab-tl lab-tl-${take.duration}">
      <header>
        <div><p>Move timeline / event-derived</p><h4>${take.key}</h4></div>
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

function hexframeVisual() {
  return `<div class="project-visual lab-preview" role="img" aria-label="Hexframe training mode: two authored attacks deal 30 and 20 damage, produce impact sparks, reduce the dummy's health, and push the dummy backward in sync with the move timeline">
    <header class="lab-brand">
      <p class="lab-eyebrow">Hexframe / Training</p>
      <strong>Prime. Link. Cash out.</strong>
      <p class="lab-sub">Build a sixteen-technique arsenal. Route statuses. Finish the fight.</p>
    </header>
    <div class="lab-stage">
      <div class="lab-hud">
        <div class="lab-player"><span>You</span><div class="lab-meters"><div class="lab-hp"><i class="lab-hp-p1"></i></div><div class="lab-sta"><i></i></div></div><strong><b>1050</b><small>100 STA</small></strong></div>
        <div class="lab-player lab-player-right"><strong><b class="lab-health-readout"><i class="lab-health-number lab-health-1000">1000</i><i class="lab-health-number lab-health-970">970</i><i class="lab-health-number lab-health-950">950</i></b><small>100 STA</small></strong><div class="lab-meters"><div class="lab-hp"><i class="lab-hp-p2"></i></div><div class="lab-sta"><i></i></div></div><span>Dummy</span></div>
      </div>
      <svg viewBox="-150 -125 300 158" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <rect x="-400" y="-125" width="800" height="158" fill="#080a0f"/>
        <rect x="-400" y="0" width="800" height="33" fill="#121219"/>
        <line x1="0" y1="-125" x2="0" y2="33" stroke="#21262d" stroke-width="1" stroke-dasharray="4 8"/>
        <line x1="-400" y1="0" x2="400" y2="0" stroke="#484f58" stroke-width="2"/>
        ${LAB_TAKES.map(labTake).join("")}
      </svg>
      <div class="lab-legend"><span class="lab-key lab-key-hurt">Hurtbox</span><span class="lab-key lab-key-hit">Hitbox</span></div>
      ${LAB_TAKES.map((take) => `<div class="lab-take lab-take-${take.id} lab-route"><span>Hit confirmed</span><strong>${take.key}</strong><em>${take.damage} damage · ${take.pushback} pushback · ${take.active}f active</em></div>`).join("")}
    </div>
    ${LAB_TAKES.map(labTimeline).join("")}
  </div>`;
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
  const play = project.liveUrl ? `<a class="text-link" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Play <span aria-hidden="true">↗</span></a>` : "";
  const caseStudy = `<a class="text-link" href="/projects/${project.slug}/case-study/">Case Study <span aria-hidden="true">→</span></a>`;
  const github = `<a class="text-link" href="${project.sourceUrl}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>`;
  return `<div class="project-card-actions">${play}${caseStudy}${github}</div>`;
}

function projectCard(project) {
  return `<article class="project-card">
    <div class="project-card-visual">${projectVisual(project)}</div>
    <div class="project-card-copy"><span class="project-number">${project.number} / ${escapeHtml(project.eyebrow)}</span><h3><a href="/projects/${project.slug}/">${escapeHtml(project.name)}</a></h3><p>${escapeHtml(project.description)}</p>${projectCardActions(project)}</div>
  </article>`;
}

function selectedWork() {
  return `<div class="selected-work-grid">${professionalRoles.map((role) => `<article><span>${escapeHtml(role.dates)}</span><h3>${escapeHtml(role.organization)}</h3><strong>${escapeHtml(role.role)}</strong><p>${escapeHtml(role.summary)}</p></article>`).join("")}</div>`;
}

function capabilityGrid() {
  const items = [
    ["01", "Software engineering", "Browser applications, APIs, data pipelines, CLIs, simulation, testing, and production support."],
    ["02", "Systems integration", "Getting separate systems to work as one — warehouses, ERPs, storefronts, shipping carriers, and logins — through APIs, EDI, and data mapping."],
    ["03", "Implementation", "Requirements, workflow analysis, migration, configuration, QA, training, go-live, and stabilization."],
    ["04", "Technical project delivery", "Cross-functional planning, team leadership, risk management, release cadence, and accountable handoff."],
    ["05", "Operations, QA & governance", "Observability, incidents, recovery, secure change, evidence, and ISO-aligned management systems."]
  ];
  return `<div class="capability-grid">${items.map(([number, title, copy]) => `<article><small>${number}</small><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div>`;
}

function home(build) {
  const body = `<main class="site-main" id="main" tabindex="-1">
    <section class="hero jacob-hero"><div class="home-statement-card"><h2>I build systems that hold up.</h2></div><div><p class="kicker">Software engineer · Systems · Project delivery</p><h1>Jacob <span>Yongue.</span></h1></div><div class="hero-side"><p>I design, build, integrate, and deliver software systems from requirements through production.</p><div class="button-row"><a class="button button-primary" href="/projects/">Projects <span aria-hidden="true">→</span></a><a class="button" href="/work/">Work</a><a class="button" href="${GITHUB}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div></div></section>
    <section class="portfolio-section selected-projects" aria-labelledby="selected-projects-heading"><div class="section-heading"><div><p class="kicker">Selected projects</p><h2 id="selected-projects-heading">Independent systems, shipped.</h2></div><a class="text-link" href="/projects/">All projects <span aria-hidden="true">→</span></a></div><div class="project-card-grid">${projects.map(projectCard).join("")}</div></section>
    <section class="portfolio-section selected-work" aria-labelledby="selected-work-heading"><div class="section-heading"><div><p class="kicker">Selected work</p><h2 id="selected-work-heading">Systems delivered in real operations.</h2></div><a class="text-link" href="/work/">Professional portfolio <span aria-hidden="true">→</span></a></div>${selectedWork()}</section>
    <section class="portfolio-section capabilities" aria-labelledby="capabilities-heading"><div class="section-heading"><div><p class="kicker">Capabilities</p><h2 id="capabilities-heading">Build, connect, deliver, operate.</h2></div></div>${capabilityGrid()}</section>
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
    <section class="systems-resume-section" aria-labelledby="work-systems"><header><div><p class="kicker">Systems delivered</p><h2 id="work-systems">Real systems in real operations.</h2></div><p>Grouped by the problem and operating environment—not as a technology inventory.</p></header><div class="systems-resume-grid">${systemGroups.map((group) => `<article class="proof-group"><h3>${escapeHtml(group.title)}</h3>${capabilityList(group.items)}</article>`).join("")}</div></section>
    <section class="systems-resume-section" aria-labelledby="work-integrations"><header><div><p class="kicker">Integrations</p><h2 id="work-integrations">Connected business operations.</h2></div><p>Enterprise, warehouse, logistics, commerce, development, and automation platforms integrated into production workflows.</p></header><div class="systems-resume-grid">${integrationGroups.map((group) => `<article class="proof-group"><h3>${escapeHtml(group.title)}</h3>${referenceList(group.items)}</article>`).join("")}</div></section>
    <section class="systems-resume-section" aria-labelledby="work-deployments"><header><div><p class="kicker">Deployments</p><h2 id="work-deployments">Organizations and environments.</h2></div><p>Named deployment context from Jacob’s employment history. Organization links are provided for identification only.</p></header>${referenceList(deployments)}</section>
    <section class="professional-skills" aria-labelledby="skills-heading"><div class="professional-section-heading"><div><p class="kicker">Core skills</p><h2 id="skills-heading">The delivery stack.</h2></div><p>The languages, platforms, and practices this professional record was delivered on.</p></div><div class="skill-columns">${professionalSkills.map((group) => `<div><strong>${escapeHtml(group.label)}</strong>${tags(group.items, group.label)}</div>`).join("")}</div></section>
    <section class="professional-education" aria-labelledby="education-heading"><div><p class="kicker">Education &amp; certification</p><h2 id="education-heading">${escapeHtml(professionalEducation.degree.institution)}.</h2><p>${escapeHtml(professionalEducation.degree.credential)}, ${escapeHtml(professionalEducation.degree.completed)}. ${escapeHtml(professionalEducation.certification.name)}: ${escapeHtml(professionalEducation.certification.status)}, ${escapeHtml(professionalEducation.certification.year)}. A further ${escapeHtml(professionalEducation.hours)} of ${escapeHtml(professionalEducation.provider)} continuing education completed in ${escapeHtml(professionalEducation.completed)}; that portion is a record of education, not a certification claim.</p></div><div>${tags(professionalEducation.topics, "Education topics")}</div></section>
    <p class="logo-disclaimer">Company and product marks are shown only to identify project context. All marks remain the property of their respective owners; no endorsement is implied.</p>
  </main>`;
  return document({ title: "Work — Jacob Yongue | Professional Portfolio", description: "Jacob Yongue's professional portfolio: systems delivered, deployments, integrations, career history, QA, implementation, and production support from 2019 through 2026.", path: "/work/", current: "work", body, build });
}

function architecture(items) {
  return `<div class="architecture">${items.map(([name, detail]) => `<div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(detail)}</span></div>`).join("")}</div>`;
}

const projectNarrative = {
  sharktank: {
    tagline: "A running workload where governance can be inspected, not merely claimed.",
    what: "A realtime multiplayer production workload used to demonstrate ISO/IEC 27001- and ISO/IEC 42001-aligned controls through live operational evidence, accessible interfaces, spend boundaries, controlled degradation, and maintained availability.",
    why: "Compliance claims are easy to write and difficult to prove. SharkTank tests whether security, AI, reliability, accessibility, cost, and continuity requirements can stay concrete when attached to a real workload instead of a hypothetical company or slide deck.",
    highlights: ["ISO/IEC 27001 and ISO/IEC 42001 alignment", "Live uptime, incident, change, recovery, and receipt evidence", "WCAG 2.0 AA support across the public and game interfaces", "Spend governance with a hard gate and safe degradation"]
  },
  hexframe: {
    tagline: "Fighting-game systems made deterministic and inspectable.",
    what: "A browser-based fighting-game system and engineering laboratory built around fixed-step combat, authored frame data, replayable state, rollback-ready boundaries, keyboard and gamepad parity, semantic menus, and accessible training tools.",
    why: "Fighting games compress hard engineering problems into a visible system: timing, input, simulation authority, animation, collision, debugging, accessibility, and tools all have to agree on what happened.",
    highlights: ["Fixed 60 Hz integer simulation", "Replay and rollback contracts", "Training and debugging tools on the authoritative state model", "WCAG 2.0 AA support for menus, navigation, settings, and training interfaces"]
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
  const liveLabel = project.slug === "sharktank" ? "Play" : project.liveUrl ? "Launch application" : "Inspect source";
  const liveHref = project.liveUrl || project.sourceUrl;
  const primaryActions = project.slug === "sharktank"
    ? `<a class="button button-primary" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Play <span aria-hidden="true">↗</span></a><a class="button" href="/projects/sharktank/case-study/">Case Study <span aria-hidden="true">→</span></a><a class="button" href="${project.sourceUrl}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>`
    : `<a class="button button-primary" href="${liveHref}" target="_blank" rel="noopener noreferrer">${project.slug === "hexframe" ? "Play" : liveLabel} <span aria-hidden="true">↗</span></a><a class="button" href="/projects/${project.slug}/case-study/">Case Study <span aria-hidden="true">→</span></a><a class="button" href="${project.sourceUrl}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>`;
  const body = `<main class="case-main showcase-main" id="main" tabindex="-1"><a class="crumb" href="/projects/">← Projects</a>
    <section class="showcase-hero"><p class="kicker">${project.number} / ${escapeHtml(project.eyebrow)}</p><h1>${escapeHtml(project.name)}</h1><p>${escapeHtml(copy.tagline)}</p><div class="button-row">${primaryActions}</div></section>
    <div class="case-visual showcase-visual">${projectVisual(project)}</div>
    <section class="showcase-overview"><article><p class="kicker">What it is</p><h2>A complete working system.</h2><p>${escapeHtml(copy.what)}</p></article><article><p class="kicker">Why I built it</p><h2>The engineering question.</h2><p>${escapeHtml(copy.why)}</p></article></section>
    <section class="case-section"><div class="case-label">Engineering highlights</div><div><h2>What the project demonstrates.</h2><ul class="built-list">${copy.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="project-depth"><div><p class="kicker">Go deeper</p><h2>Overview first. Evidence when you want it.</h2></div><div><p>The case study explains the architecture, boundaries, tradeoffs, and current state. The running application and repository provide the proof.</p><div class="button-row"><a class="button button-primary" href="/projects/${project.slug}/case-study/">Read case study <span aria-hidden="true">→</span></a><a class="button" href="${liveHref}" target="_blank" rel="noopener noreferrer">${liveLabel} <span aria-hidden="true">↗</span></a></div></div></section>
  </main>`;
  return document({ title: `${project.name} — Project by Jacob Yongue`, description: `${copy.tagline} ${copy.what}`, path: `/projects/${project.slug}/`, current: "projects", body, build });
}

function sharkTankCaseStudy(project, build) {
  const operatingControls = [
    "The current service status and uptime number come from the running system",
    "Incident records explain what happened, who was affected, and how the issue was closed",
    "Each release records what changed and which live behavior proves it works",
    "Daily backups are tested by restoring and reading the saved copy",
    "The service counts resource use and stops costly actions at a hard limit",
    "Important operator actions are added to a history that can be checked for changes"
  ];
  const aiControls = [
    "Computer sharks exist only to fill empty seats and make the tank active",
    "The same starting state and player actions always produce the same bot behavior",
    "Bots cannot read a player's name or profile, make decisions about people, or fire rockets",
    "Every change to a bot rule is saved, reviewed, and tied to a release",
    "Replays make bot movement and decisions easy to inspect",
    "The limits are documented, and a human operator remains in control"
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
    <div class="case-visual">${projectVisual(project)}</div>
    <section class="case-section"><div class="case-label">01 — Problem</div><div><h2>A checklist does not prove a system is safe.</h2><p>${escapeHtml(project.problem)}</p></div></section>
    <section class="case-section"><div class="case-label">02 — Approach</div><div><h2>Run the rules against a real game.</h2><p>The game gives those rules something real to control. Players join rooms, information changes in real time, incidents can happen, backups can be tested, and running the service costs money. Each part creates a record that shows whether the rule worked.</p></div></section>
    <section class="case-section"><div class="case-label">03 — ISO/IEC 27001</div><div><h2>Show how security is handled.</h2><p><strong>ISO/IEC 27001</strong> is a framework for managing information-security risks. In Shark Tank, topics such as access, code changes, incidents, suppliers, and backups link to a live page or record. Items that are incomplete, handled by a supplier, not relevant, or still need work are labelled instead of hidden. The project follows the framework for practice; it is not certified.</p></div></section>
    <section class="case-section"><div class="case-label">04 — ISO/IEC 42001</div><div><h2>These sharks follow rules, not a trained AI model.</h2><p><strong>ISO/IEC 42001</strong> is a framework for managing AI systems. Shark Tank uses it to document what the computer sharks may do, what information they may use, how their behavior is tested, and how changes are approved. The sharks run programmed rules; there is no training data, learned model, or outside AI service.</p><ul class="built-list">${aiControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="case-section"><div class="case-label">05 — Reliability</div><div><h2>The uptime number comes from the incident log.</h2><p>The site does not type an uptime percentage into a marketing page. It calculates the number from every recorded outage since the project started. When the record supports it, the page says <strong>100% uptime maintained</strong>. If an outage is recorded, the number changes automatically.</p><ul class="built-list">${operatingControls.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="case-section"><div class="case-label">06 — Accessibility</div><div><h2>More people can use the site and its controls.</h2><p><strong>WCAG 2.0 AA</strong> is a common set of web-accessibility rules. Shark Tank's public pages, menus, settings, and supported game controls are tested against those rules. This does not mean every visual action in the game has a matching nonvisual version; the claim covers the listed screens and controls.</p><ul class="built-list">${accessibilityControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="case-section"><div class="case-label">07 — Cost governance</div><div><h2>Spending cannot grow forever.</h2><p>The service counts how many paid resources it uses. When it reaches a hard limit, it pauses actions that could add more cost, such as gameplay and public writes. Read-only status pages, evidence, security reports, and recovery tools stay available. An approved operator can restore normal service after reviewing the limit.</p>${architecture([
      ["Normal", "The game, updates, and public records work normally"],
      ["Limit reached", "Actions that could create more cost are paused"],
      ["Important pages stay up", "Status, evidence, security reports, and recovery remain available"],
      ["Restart", "An approved operator reviews the limit and restores normal service"]
    ])}</div></section>
    <section class="case-section"><div class="case-label">08 — Evidence</div><div><h2>Follow each claim to its proof.</h2><p>A written policy is only a starting point. Each supported claim links to the feature, live page, or saved record that proves what happened. If the proof is missing or limited, the site says so.</p>${architecture([
      ["Rule", "Explain what should happen and where the rule applies"],
      ["Safeguard", "Choose the code or operating step that enforces the rule"],
      ["Running feature", "Make the safeguard part of the real service"],
      ["Record", "Show the current result and keep a history that can be checked"]
    ])}</div></section>
    <section class="case-section"><div class="case-label">09 — Architecture</div><div><h2>Each service has one job.</h2>${architecture(project.architecture)}<p>The Worker handles web requests and public pages. Durable Objects keep live game rooms, logs, and operator records. R2 stores separate backup copies that recovery tests read later.</p></div></section>
    <section class="case-section"><div class="case-label">10 — Result</div><div><h2>Visitors can check the work.</h2><p>${escapeHtml(project.result)}</p><p>The point is simple: the site shows records from the running service instead of asking visitors to trust a list of claims.</p>${actions(project)}</div></section>
  </main>`;
  return document({
    title: "SharkTank — ISO 27001 & ISO 42001 Governance Case Study | WizardGang",
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
  const accessibility = project.slug === "hexframe" ? `<section class="case-section"><div class="case-label">05 — Accessibility</div><div><h2>Menus and controls are built for more players.</h2><p><strong>WCAG 2.0 AA</strong> is a common set of web-accessibility rules. Hexframe applies those rules to its menus, navigation, settings, training lab, and supported game controls. Keyboard and gamepad buttons trigger the same actions. Dialogs keep keyboard focus inside them and return the user to the right place when they close. Important status and combat messages are also available to screen readers.</p><ul class="built-list"><li>Complete keyboard operation for menus, training, move sets, settings, and supported combat controls</li><li>A stronger-focus option, clearly labelled tabs and dialogs, and predictable focus restoration</li><li>Larger text, high-contrast and color-vision modes, captions, and screen-reader combat messages</li><li>A reduced-motion setting that removes movement that is not needed to play</li><li>Training tools with clear labels for frames, moves, equipment, and combat status</li></ul><p>This claim covers the listed screens and controls. It does not claim that every visual fighting-game action has a complete nonvisual replacement.</p></div></section>` : "";
  const resultNumber = project.slug === "hexframe" ? "06" : "05";
  const engineeringHeading = project.slug === "hexframe"
    ? "Graphics show the fight; game rules decide it."
    : "Do the hard work before the reader opens.";
  const resultHeading = project.slug === "hexframe"
    ? "A playable foundation that can grow."
    : "A library that can recover and be rebuilt.";
  const body = `<main class="case-main" id="main" tabindex="-1"><a class="crumb" href="/projects/${project.slug}/">← ${escapeHtml(project.name)} overview</a>
    <section class="case-hero"><div><p class="kicker">${project.number} / ${escapeHtml(project.eyebrow)}</p><h1>${escapeHtml(project.name)}</h1></div><div><p class="case-lede">${escapeHtml(project.description)}</p>${tags(project.tags)}${actions(project)}</div></section>
    <div class="case-visual">${projectVisual(project)}</div>
    <section class="case-section"><div class="case-label">01 — Problem</div><div><h2>Why this is hard.</h2><p>${escapeHtml(project.problem)}</p></div></section>
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
  return `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)} <span class="sr-only">(opens in a new tab)</span></a>`;
}

function referenceList(items) {
  return `<ul class="reference-cloud">${items.map((item) => `<li>${officialReference(item)}</li>`).join("")}</ul>`;
}

function capabilityList(items) {
  return `<ul class="capability-cloud">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
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
    ["about/index.html", about(build)],
    ["404.html", notFound(build)]
  ]);
}

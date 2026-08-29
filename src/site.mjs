import { projects } from "./projects.mjs";
import { professionalEducation, professionalProjects, professionalRoles } from "./professional.mjs";

const SITE_ORIGIN = "https://wizardgang.ai";
const GITHUB = "https://github.com/SouthernGentlemen";

const escapeHtml = (value) => String(value).replace(/[&<>\"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;"
})[character]);

function header(current = "") {
  const nav = [
    ["work", "/work/", "Independent"],
    ["professional", "/professional/", "Professional"],
    ["about", "/about/", "About"],
    ["resume", "/resume/", "Resume"]
  ].map(([key, href, label]) => `<a href="${href}"${current === key ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  return `<a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <a class="wordmark" href="/" aria-label="WizardGang home"><span class="wordmark-mark" aria-hidden="true"></span>WIZARDGANG</a>
      <nav class="site-nav" aria-label="Primary">${nav}<a href="${GITHUB}">GitHub <span aria-hidden="true">↗</span></a></nav>
    </header>`;
}

function footer(build) {
  return `<footer class="site-footer"><span>WizardGang · independent builds + professional delivery</span><span>Build <a href="/version.json">${escapeHtml(build.commit)}</a> · 2026</span></footer>`;
}

function document({ title, description, path, current, body, build, social = false, noindex = false }) {
  const canonical = `${SITE_ORIGIN}${path}`;
  const identity = noindex
    ? '<meta name="robots" content="noindex">'
    : `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}">`;
  const socialImage = social
    ? `<meta property="og:image" content="${SITE_ORIGIN}/og.jpg"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="WizardGang — software that holds up"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SITE_ORIGIN}/og.jpg">`
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
    ${footer(build)}
  </body>
</html>`;
}

const tags = (items, label = "Technologies") => `<ul class="tags" aria-label="${escapeHtml(label)}">${items.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>`;

function actions(project, compact = false) {
  const className = compact ? "text-link" : "button";
  const links = [`<a class="${compact ? "text-link" : "button button-primary"}" href="/work/${project.slug}/">${compact ? "Case study" : "View project"} <span aria-hidden="true">→</span></a>`];

  if (project.slug === "sharktank") {
    if (project.operationsUrl) links.push(`<a class="${className}" href="${project.operationsUrl}">Trust &amp; evidence <span aria-hidden="true">↗</span></a>`);
    if (project.liveUrl) links.push(`<a class="${className}" href="${project.liveUrl}">Live system <span aria-hidden="true">↗</span></a>`);
  } else {
    if (project.liveUrl) links.push(`<a class="${className}" href="${project.liveUrl}">Live demo <span aria-hidden="true">↗</span></a>`);
    if (project.operationsUrl) links.push(`<a class="${className}" href="${project.operationsUrl}">Operations <span aria-hidden="true">↗</span></a>`);
  }

  if (project.sourcePublic && project.sourceUrl) links.push(`<a class="${className}" href="${project.sourceUrl}">Source <span aria-hidden="true">↗</span></a>`);
  return `<div class="${compact ? "text-links" : "button-row"}">${links.join("")}</div>`;
}

// Both product previews below are traced from the live apps rather than invented: the
// Shark Tank mascot is the same path data the game rasterises for every skin, and the
// Hexframe fighter is the shipped rig drawn at its idle pose. Colours are copied from
// each product's own tokens, so a change there is visible here as a mismatch.
function sharkTankVisual() {
  return `<div class="project-visual tank-preview" role="img" aria-label="Shark Tank gameplay: the player's cyan shark among rivals in a live tank, with the points, rank and size readouts, the top sharks leaderboard, and the dash and rocket abilities">
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
        </defs>
        <rect width="800" height="470" fill="#0b0a14"/>
        <rect width="800" height="470" fill="url(#tankSea)"/>
        <g stroke="#315468" stroke-opacity=".54" stroke-width="1">
          <path d="M96 0v470M226 0v470M356 0v470M486 0v470M616 0v470"/>
        </g>
        <g class="tank-food">
          <circle cx="196" cy="196" r="3.4" fill="#ffd54a" opacity=".8"/>
          <circle cx="243" cy="286" r="3.4" fill="#22e6ff" opacity=".8"/>
          <circle cx="404" cy="150" r="3.4" fill="#ffd54a" opacity=".8"/>
          <circle cx="470" cy="268" r="5" fill="#ff8a1f" opacity=".98"/>
          <circle cx="330" cy="404" r="3.4" fill="#ffd54a" opacity=".8"/>
          <circle cx="150" cy="330" r="3.4" fill="#22e6ff" opacity=".8"/>
          <circle cx="530" cy="196" r="3.4" fill="#ffd54a" opacity=".8"/>
        </g>
        <g class="tank-fish tank-fish-a">
          <use href="#tankShark" x="180" y="110" width="78" height="48" class="skin-gold"/>
          <g class="tank-tag"><rect x="186" y="82" width="70" height="21" rx="6" fill="#ffe14d"/><text x="221" y="97">Chowder</text></g>
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
          <use href="#tankShark" x="286" y="212" width="106" height="65" class="skin-cyan"/>
          <g class="tank-tag"><rect x="284" y="178" width="110" height="23" rx="6" fill="#22e6ff"/><text x="339" y="194">Player (you)</text></g>
        </g>
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

function hexframeVisual() {
  const fighter = `<g id="hfRig">
    <g transform="translate(0 -46)">
      <rect x="-9" y="-6" width="18" height="12" rx="4" fill="var(--body, #7f8fd0)"/>
      <g transform="translate(-1 0) rotate(-6)">
        <rect x="-5.5" y="0" width="11" height="24" rx="4.5" fill="var(--far, #4a5a86)"/>
        <g transform="translate(0 24) rotate(8)">
          <rect x="-5" y="0" width="10" height="22" rx="4" fill="var(--far, #4a5a86)"/>
          <g transform="translate(0 22)"><rect x="-4" y="0" width="16" height="6" rx="2.5" fill="var(--far-dark, #3b4a70)"/></g>
        </g>
      </g>
      <g>
        <rect x="-11" y="-30" width="22" height="30" rx="6" fill="var(--body, #7f8fd0)"/>
        <rect x="-11" y="-18" width="22" height="3" fill="var(--accent, #c9d4ff)" opacity=".65"/>
        <g transform="translate(-2 -26) rotate(-12)">
          <rect x="-4" y="0" width="8" height="16" rx="3.5" fill="var(--far, #4a5a86)"/>
          <g transform="translate(0 16) rotate(-28)">
            <rect x="-3.5" y="0" width="7" height="14" rx="3" fill="var(--far, #4a5a86)"/>
            <g transform="translate(0 14)"><circle cx="0" cy="3" r="4.5" fill="var(--far-dark, #3b4a70)"/></g>
          </g>
        </g>
        <g transform="translate(0 -30)">
          <circle cx="1" cy="-11" r="11" fill="var(--body, #7f8fd0)"/>
          <path d="M 8 -15 L 14 -12 L 8 -9 Z" fill="var(--accent, #c9d4ff)"/>
        </g>
        <g transform="translate(2 -26) rotate(-18)">
          <rect x="-4" y="0" width="8" height="16" rx="3.5" fill="var(--near, #9aa9e8)"/>
          <g transform="translate(0 16) rotate(-34)">
            <rect x="-3.5" y="0" width="7" height="14" rx="3" fill="var(--near, #9aa9e8)"/>
            <g transform="translate(0 14)"><circle cx="0" cy="3" r="5" fill="var(--near-dark, #7686c4)"/></g>
          </g>
        </g>
      </g>
      <g transform="translate(1 0) rotate(8)">
        <rect x="-5.5" y="0" width="11" height="24" rx="4.5" fill="var(--near, #9aa9e8)"/>
        <g transform="translate(0 24) rotate(-6)">
          <rect x="-5" y="0" width="10" height="22" rx="4" fill="var(--near, #9aa9e8)"/>
          <g transform="translate(0 22)"><rect x="-4" y="0" width="16" height="6" rx="2.5" fill="var(--near-dark, #7686c4)"/></g>
        </g>
      </g>
    </g>
  </g>`;
  return `<div class="project-visual lab-preview" role="img" aria-label="Hexframe training mode: the player fighter facing the training dummy on the deterministic stage, with health and stamina meters and the active route readout">
    <header class="lab-brand">
      <p class="lab-eyebrow">Hexframe / Training</p>
      <strong>Prime. Link. Cash out.</strong>
      <p class="lab-sub">Build a sixteen-technique arsenal. Route statuses. Finish the fight.</p>
    </header>
    <div class="lab-stage">
      <div class="lab-hud">
        <div class="lab-player"><span>You</span><div class="lab-meters"><div class="lab-hp"><i class="lab-hp-p1"></i></div><div class="lab-sta"><i></i></div></div><strong><b>1050</b><small>100 STA</small></strong></div>
        <div class="lab-player lab-player-right"><strong><b>1000</b><small>100 STA</small></strong><div class="lab-meters"><div class="lab-hp"><i class="lab-hp-p2"></i></div><div class="lab-sta"><i></i></div></div><span>Dummy</span></div>
      </div>
      <svg viewBox="-150 -125 300 165" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <defs>${fighter}</defs>
        <rect x="-150" y="-125" width="300" height="165" fill="#080a0f"/>
        <rect x="-150" y="0" width="300" height="40" fill="#121219"/>
        <line x1="0" y1="-125" x2="0" y2="40" stroke="#21262d" stroke-width="1" stroke-dasharray="4 8"/>
        <line x1="-150" y1="0" x2="150" y2="0" stroke="#484f58" stroke-width="2"/>
        <g transform="translate(-40 0)"><g class="lab-idle"><use href="#hfRig" class="fighter-p1"/></g></g>
        <g transform="translate(40 0) scale(-1 1)"><g class="lab-idle lab-idle-b"><use href="#hfRig" class="fighter-p2"/></g></g>
      </svg>
      <div class="lab-route"><span>Active</span><strong>Ready</strong><em>Choose any 16 of 29 moves</em></div>
    </div>
  </div>`;
}

function projectVisual(project) {
  if (project.slug === "sharktank") return sharkTankVisual();
  if (project.slug === "hexframe") return hexframeVisual();
  return `<div class="project-visual archive-visual" role="img" aria-label="YarReader source to portable HTML flow"><header><strong>YAR / EXPORT</strong><span>OFFLINE BY DESIGN</span></header><div class="archive-files"><span><b>SOURCE</b><em>mixed publication formats</em><code>VERIFY</code></span><span><b>NORMALIZE</b><em>deterministic pages</em><code>HASH</code></span><span><b>HTML</b><em>relative static export</em><code>NO SERVER</code></span></div><footer><span>Recoverable</span><span>Portable</span><span>Verified</span></footer></div>`;
}

function projectCard(project, index) {
  return `<article class="project-row${index % 2 ? " project-row-reverse" : ""}">
    <div class="project-copy"><span class="project-number">${project.number} / ${escapeHtml(project.eyebrow)}</span><h3><a href="/work/${project.slug}/">${escapeHtml(project.name)}</a></h3><p>${escapeHtml(project.description)}</p>${tags(project.tags.slice(0, 5))}${actions(project, true)}</div>
    ${projectVisual(project)}
  </article>`;
}

function home(build) {
  const body = `<main class="site-main" id="main" tabindex="-1">
    <section class="hero"><div><p class="kicker">Software engineering + project delivery</p><h1>Software systems <span>built to hold up.</span></h1></div><div class="hero-side"><p>I take products and operational change from a clear model through implementation, deployment, adoption, and the evidence that makes results understandable.</p><p class="hero-meta">TypeScript · Cloudflare · APIs · Warehouse systems · Integrations · Delivery</p><div class="button-row"><a class="button button-primary" href="/professional/">Professional portfolio <span aria-hidden="true">→</span></a><a class="button" href="/work/">Independent lab</a><a class="button" href="/resume/">Resume</a></div></div></section>
    <section class="work-tracks" aria-labelledby="work-tracks-heading"><div class="section-heading"><div><p class="kicker">Two bodies of work</p><h2 id="work-tracks-heading">Different contexts. Clear boundaries.</h2></div></div><div class="track-grid"><article><span>01 / Professional</span><h3>Delivery in operating businesses.</h3><p>Warehouse systems, WMS and carrier integrations, public-sector CMS migration, QA leadership, training, and production change.</p><a class="text-link" href="/professional/">View professional portfolio <span aria-hidden="true">→</span></a></article><article><span>02 / Independent</span><h3>The build lab.</h3><p>Games, realtime edge systems, archival tools, and the experiments I choose to take from idea through production.</p><a class="text-link" href="/work/">Explore independent work <span aria-hidden="true">→</span></a></article></div></section>
    <section class="work-preview" aria-labelledby="selected-work"><div class="section-heading"><div><p class="kicker">Independent build lab</p><h2 id="selected-work">Three focused case studies.</h2></div><span>03 PROJECTS</span></div>${projects.map(projectCard).join("")}</section>
    <section class="capabilities" aria-labelledby="capabilities-heading"><div class="section-heading"><div><p class="kicker">Capabilities</p><h2 id="capabilities-heading">Core engineering scope.</h2></div></div><div class="capability-grid">
      <article><small>01</small><h3>Software engineering</h3><p>TypeScript, browser applications, APIs, SQL, CLIs, protocols, and automation.</p></article>
      <article><small>02</small><h3>Platform &amp; web services</h3><p>Cloudflare, distributed state, REST, realtime systems, deployment, and recovery.</p></article>
      <article><small>03</small><h3>Security &amp; identity</h3><p>OAuth/OIDC, SSO, RBAC, trust boundaries, risk controls, and observability.</p></article>
      <article><small>04</small><h3>AI &amp; deterministic systems</h3><p>AI governance, agent workflows, simulation, replay, and reproducible behavior.</p></article>
    </div></section>
    <section class="about-teaser" aria-labelledby="about-teaser-heading"><div><p class="kicker">About</p><h2 id="about-teaser-heading">Independent engineering practice.</h2></div><div><p>WizardGang is focused on building complete, inspectable systems rather than isolated demonstrations—from product behavior through the controls and evidence needed to operate them.</p><a class="text-link" href="/about/">About the work <span aria-hidden="true">→</span></a></div></section>
  </main>`;
  return document({ title: "WizardGang — Software Engineering Portfolio", description: "WizardGang builds production software across security and AI governance, deterministic systems, Cloudflare platforms, APIs, and automation.", path: "/", body, build, social: true });
}

function work(build) {
  const body = `<main class="case-main" id="main" tabindex="-1"><section class="page-hero"><p class="kicker">Independent build lab</p><h1>Governance.<br><span>Simulation. Portability.</span></h1><p>This is the independent side of WizardGang: products, games, and experiments I build because the engineering problem is worth exploring. Professional client and employer work lives in its own portfolio.</p><div class="button-row page-hero-actions"><a class="button" href="/professional/">Professional portfolio <span aria-hidden="true">→</span></a></div></section><section class="work-list" aria-label="Independent projects">${projects.map(projectCard).join("")}</section></main>`;
  return document({ title: "Independent Work — WizardGang", description: "Independent WizardGang builds: Shark Tank, Hexframe, and YarReader.", path: "/work/", current: "work", body, build });
}

function companyMark(project) {
  if (project.logo) {
    return `<img class="${escapeHtml(project.logoClass || "")}" src="${escapeHtml(project.logo)}" alt="${escapeHtml(project.logoAlt)}" loading="lazy" decoding="async">`;
  }
  return `<span class="company-wordmark" role="img" aria-label="${escapeHtml(project.company)}">${escapeHtml(project.logoText || project.company)}</span>`;
}

function professionalProjectCard(project, index) {
  return `<article class="professional-card">
    <header><div class="company-mark">${companyMark(project)}</div><span>${String(index + 1).padStart(2, "0")}</span></header>
    <div class="professional-card-copy"><p class="professional-category">${escapeHtml(project.category)}</p><h3>${escapeHtml(project.name)}</h3><p class="company-context">${escapeHtml(project.company)} · Delivered at ${escapeHtml(project.organization)}</p><p class="professional-outcome">${escapeHtml(project.outcome)}</p></div>
    <dl class="professional-facts"><div><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div><div><dt>Dates</dt><dd>${escapeHtml(project.dates)}</dd></div><div><dt>Method</dt><dd>${escapeHtml(project.method)}</dd></div><div><dt>Scale</dt><dd>${escapeHtml(project.team)} people · ${escapeHtml(project.budget)}</dd></div></dl>
  </article>`;
}

function professionalProjectSection({ id, kicker, title, intro, items }) {
  return `<section class="professional-projects" aria-labelledby="${id}"><div class="professional-section-heading"><div><p class="kicker">${escapeHtml(kicker)}</p><h2 id="${id}">${escapeHtml(title)}</h2></div><p>${escapeHtml(intro)}</p></div><div class="professional-grid">${items.map((project) => professionalProjectCard(project, professionalProjects.indexOf(project))).join("")}</div></section>`;
}

function professional(build) {
  const fulfillment = professionalProjects.slice(0, 9);
  const business = [professionalProjects[9], professionalProjects[11]];
  const enterprise = [professionalProjects[10], ...professionalProjects.slice(12)];
  const body = `<main class="case-main professional-main" id="main" tabindex="-1">
    <section class="professional-hero"><div><p class="kicker">Professional delivery portfolio</p><h1>Production work.<br><span>Operational stakes.</span></h1></div><div class="professional-hero-copy"><p>Fifteen projects across warehouse fulfillment, enterprise integration, public-sector case management, and business ownership. This record is intentionally separate from the independent build lab.</p><div class="professional-stats" aria-label="Professional portfolio summary"><div><strong>15</strong><span>Projects</span></div><div><strong>2019-25</strong><span>Delivery record</span></div><div><strong>38.5</strong><span>PM education hours</span></div></div></div></section>
    <section class="professional-experience" aria-labelledby="experience-heading"><div class="professional-section-heading"><div><p class="kicker">Experience</p><h2 id="experience-heading">Roles across the delivery path.</h2></div><p>Hands-on work from requirements and technical planning through implementation, QA, launch, training, stabilization, and support.</p></div><div class="experience-grid">${professionalRoles.map((item) => `<article><span>${escapeHtml(item.dates)}</span><h3>${escapeHtml(item.organization)}</h3><strong>${escapeHtml(item.role)}</strong><p>${escapeHtml(item.summary)}</p></article>`).join("")}</div></section>
    ${professionalProjectSection({ id: "fulfillment-projects", kicker: "01 / Warehouse & fulfillment", title: "Systems on the warehouse floor.", intro: "Light-directed picking, WMS integration, inventory traceability, carrier workflows, QA, training, and onsite adoption across nine delivery engagements.", items: fulfillment })}
    ${professionalProjectSection({ id: "enterprise-projects", kicker: "02 / Enterprise platforms", title: "Change without losing the operation.", intro: "Public-sector migration planning, WMS modernization, post-acquisition integration, and returns processing with data integrity and continuity at the center.", items: enterprise })}
    ${professionalProjectSection({ id: "business-projects", kicker: "03 / Business ownership", title: "Accountable from permit to closeout.", intro: "Two seasonal operating cycles with direct responsibility for compliance, positioning, bookings, service, property readiness, and financial outcomes.", items: business })}
    <section class="professional-education" aria-labelledby="education-heading"><div><p class="kicker">Project management education</p><h2 id="education-heading">${escapeHtml(professionalEducation.hours)} completed.</h2><p>Completed with ${escapeHtml(professionalEducation.provider)} in ${escapeHtml(professionalEducation.completed)}. This is a record of education completed; it is not presented as a certification claim.</p></div><div>${tags(professionalEducation.topics, "Education topics")}</div></section>
    <p class="logo-disclaimer">Company and product marks are shown only to identify project context. All marks remain the property of their respective owners; no endorsement is implied.</p>
  </main>`;
  return document({ title: "Professional Portfolio — Jacob Yongue | WizardGang", description: "Jacob Yongue's professional delivery portfolio across warehouse systems, WMS integration, public-sector case management, QA, implementation, and business operations.", path: "/professional/", current: "professional", body, build });
}

function architecture(items) {
  return `<div class="architecture">${items.map(([name, detail]) => `<div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(detail)}</span></div>`).join("")}</div>`;
}

function sharkTankPage(project, build) {
  const operatingControls = [
    "Availability and service state exposed from the running system",
    "Incident records with cause, impact, status, and closure",
    "Change records tied to production behavior and evidence",
    "Daily state copies with restore drills that read the stored copy",
    "Usage metering and a hard spend gate for variable-cost traffic",
    "Append-only operational receipts with integrity verification"
  ];
  const aiControls = [
    "Defined AI-system purpose, scope, and operating boundary",
    "Deterministic rule-based agents; no model, training-data, or inference dependency",
    "Impact assessment that states what the system does and does not decide about people",
    "Version-controlled behavior and change management",
    "Monitoring through replayable, inspectable system state",
    "Documented limitations and retained operator authority"
  ];
  const body = `<main class="case-main" id="main" tabindex="-1"><a class="crumb" href="/work/">← Selected work</a>
    <section class="case-hero"><div><p class="kicker">${project.number} / ${escapeHtml(project.eyebrow)}</p><h1>${escapeHtml(project.name)}</h1></div><div><p class="case-lede">${escapeHtml(project.description)}</p>${tags(project.tags)}${actions(project)}</div></section>
    <div class="case-visual">${projectVisual(project)}</div>
    <section class="case-section"><div class="case-label">01 — Objective</div><div><h2>Can governance be observable?</h2><p>${escapeHtml(project.problem)}</p><p>The game is the workload. The case study is the management system around it: how risk is decided, how controls are implemented, how AI-system boundaries are stated, and how evidence survives contact with the running service.</p></div></section>
    <section class="case-section"><div class="case-label">02 — ISO management system</div><div><h2>ISO/IEC 27001 and ISO/IEC 42001 are design constraints.</h2><p>The public register spans both standards and keeps management-system requirements, Annex controls, inherited supplier responsibilities, exclusions, partial implementations, and open gaps visible rather than flattening them into a compliance badge.</p>${architecture([
      ["ISO/IEC 27001", "Information security, risk, access, operations, incidents, continuity, suppliers, and secure change"],
      ["ISO/IEC 42001", "AI purpose, responsibility, impact, lifecycle, operation, monitoring, change, and transparency"],
      ["184 mapped rows", "A single readiness register links clauses and controls to the service position and available evidence"],
      ["Readiness, not certification", "The portfolio does not claim ISO certification or full conformity beyond what the evidence supports"]
    ])}</div></section>
    <section class="case-section"><div class="case-label">03 — Evidence model</div><div><h2>A control is only useful if the implementation can be inspected.</h2><p>Policies and control descriptions are not treated as proof by themselves. Register rows resolve into live routes, operational records, or explicit limitations so the evidence path remains part of the system.</p>${architecture([
      ["Policy", "State the requirement, purpose, role, and boundary"],
      ["Risk", "Assess what can fail and decide treatment"],
      ["Control", "Implement the technical or operational response"],
      ["Live evidence", "Expose the running record, result, or remaining gap"]
    ])}</div></section>
    <section class="case-section"><div class="case-label">04 — Operational controls</div><div><h2>Production behavior is part of the evidence.</h2><ul class="built-list">${operatingControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="case-section"><div class="case-label">05 — AI governance</div><div><h2>Govern the AI system before adding model complexity.</h2><p>The computer-controlled sharks are intentionally rule-based. That keeps the system testable while still exercising the governance questions ISO/IEC 42001 puts in front of an AI system: purpose, accountability, impact, change, monitoring, transparency, and limitation.</p><ul class="built-list">${aiControls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="case-section"><div class="case-label">06 — Production architecture</div><div><h2>Cloudflare is the implementation layer, not the headline.</h2>${architecture(project.architecture)}<p>Workers own routing, validation, policy, and public evidence surfaces; Durable Objects own realtime state and receipts; R2 holds independent state copies used by recovery drills.</p></div></section>
    <section class="case-section"><div class="case-label">07 — Current state</div><div><h2>Say what is proven—and what is not.</h2><p>${escapeHtml(project.result)}</p><p>The useful outcome is not an ISO logo. It is an inspectable chain from management intent to running behavior, plus enough honesty to leave partial controls and gaps visible when evidence is not sufficient.</p>${actions(project)}</div></section>
  </main>`;
  return document({
    title: "Shark Tank — ISO 27001 & ISO 42001 Governance Case Study | WizardGang",
    description: project.description,
    path: "/work/sharktank/",
    current: "work",
    body,
    build
  });
}

function projectPage(project, build) {
  if (project.slug === "sharktank") return sharkTankPage(project, build);

  const title = project.slug === "hexframe"
    ? "Hexframe — Deterministic Fighting Game Systems | WizardGang"
    : "YarReader — Portable Media Pipeline | WizardGang";
  const body = `<main class="case-main" id="main" tabindex="-1"><a class="crumb" href="/work/">← Selected work</a>
    <section class="case-hero"><div><p class="kicker">${project.number} / ${escapeHtml(project.eyebrow)}</p><h1>${escapeHtml(project.name)}</h1></div><div><p class="case-lede">${escapeHtml(project.description)}</p>${tags(project.tags)}${actions(project)}</div></section>
    <div class="case-visual">${projectVisual(project)}</div>
    <section class="case-section"><div class="case-label">01 — Problem</div><div><h2>The constraint that shapes the system.</h2><p>${escapeHtml(project.problem)}</p></div></section>
    <section class="case-section"><div class="case-label">02 — What I built</div><div><h2>A complete path, not an isolated component.</h2><ul class="built-list">${project.built.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="case-section"><div class="case-label">03 — Architecture</div><div><h2>Explicit ownership at every boundary.</h2>${architecture(project.architecture)}</div></section>
    <section class="case-section"><div class="case-label">04 — Interesting engineering</div><div><h2>The part worth looking at twice.</h2><p>${escapeHtml(project.engineering)}</p></div></section>
    <section class="case-section"><div class="case-label">05 — Result / current state</div><div><h2>What exists now.</h2><p>${escapeHtml(project.result)}</p>${actions(project)}</div></section>
  </main>`;
  return document({ title, description: project.description, path: `/work/${project.slug}/`, current: "work", body, build });
}

function about(build) {
  const body = `<main class="case-main" id="main" tabindex="-1"><section class="page-hero about-hero"><p class="kicker">About WizardGang</p><h1>Build the whole path.<br><span>Explain the hard parts.</span></h1><div class="prose"><p>WizardGang brings two bodies of work together without blending their contexts: independent products built to explore difficult engineering problems, and professional delivery completed inside operating businesses.</p><p>I work hands-on from requirements and domain models through implementation, QA, deployment, adoption, and production evidence. The aim is the smallest sound architecture and delivery plan with explicit ownership, failure behavior, security boundaries, and enough evidence for another person to understand what the system actually does.</p></div><div class="button-row"><a class="button button-primary" href="/professional/">Professional portfolio <span aria-hidden="true">→</span></a><a class="button" href="/work/">Independent lab</a><a class="button" href="${GITHUB}">GitHub <span aria-hidden="true">↗</span></a></div></section></main>`;
  return document({ title: "About — WizardGang Software Engineering", description: "About WizardGang: independent software systems and professional delivery work kept in clear, distinct portfolios.", path: "/about/", current: "about", body, build });
}

function resume(build) {
  const body = `<main class="case-main" id="main" tabindex="-1"><section class="page-hero resume-hero"><p class="kicker">Resume / selected experience</p><h1>Systems builder.<br><span>Delivery owner.</span></h1><p>Product-minded engineering and project delivery across warehouse systems, enterprise integration, public-sector platforms, security and AI governance, deterministic simulation, realtime services, and production operations.</p></section>
    <section class="resume-section" aria-labelledby="resume-professional"><p class="kicker">Professional experience</p><h2 id="resume-professional">Delivery across the lifecycle.</h2>
      ${professionalRoles.map((item) => `<article class="resume-entry"><div><strong>${escapeHtml(item.organization)}</strong><span>${escapeHtml(item.dates)}</span></div><div><h3>${escapeHtml(item.role)}</h3><p>${escapeHtml(item.summary)}</p></div></article>`).join("")}
      <a class="text-link" href="/professional/">View all 15 professional projects <span aria-hidden="true">→</span></a>
    </section>
    <section class="resume-section" aria-labelledby="resume-projects"><p class="kicker">Independent project experience</p><h2 id="resume-projects">Built end to end.</h2>
      ${projects.map((project) => `<article class="resume-entry"><div><strong>${escapeHtml(project.name)}</strong><span>${escapeHtml(project.eyebrow)}</span></div><div><h3>${escapeHtml(project.description)}</h3><ul>${project.built.slice(0, 2).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><a class="text-link" href="/work/${project.slug}/">Case study <span aria-hidden="true">→</span></a></div></article>`).join("")}
    </section>
    <section class="resume-section" aria-labelledby="resume-strengths"><p class="kicker">Core strengths</p><h2 id="resume-strengths">Architecture with a product surface.</h2><div class="strength-grid"><div><strong>System design</strong><span>Domain models, invariants, ownership, and failure recovery.</span></div><div><strong>TypeScript</strong><span>Browser apps, Workers, APIs, protocols, CLIs, and tooling.</span></div><div><strong>Cloudflare</strong><span>Workers, Durable Objects, R2, routing, deployment, and operations.</span></div><div><strong>Security &amp; governance</strong><span>Risk, controls, evidence, identity, incident response, and AI governance.</span></div><div><strong>Automation</strong><span>Durable workflows, integrations, AI proposals, and human review.</span></div><div><strong>Operations</strong><span>Observability, cost limits, changes, incidents, backups, and drills.</span></div></div></section>
    <section class="explore"><p class="kicker">Project record</p><h2>Two contexts, both inspectable.</h2><div class="button-row"><a class="button button-primary" href="/professional/">Professional portfolio <span aria-hidden="true">→</span></a><a class="button" href="/work/">Independent lab</a><a class="button" href="${GITHUB}">GitHub <span aria-hidden="true">↗</span></a></div></section>
  </main>`;
  return document({ title: "Resume — WizardGang Software Engineering", description: "WizardGang project experience across security and AI governance, TypeScript, Cloudflare, APIs, identity, automation, deterministic systems, and production operations.", path: "/resume/", current: "resume", body, build });
}

function notFound(build) {
  const body = `<main class="site-main" id="main" tabindex="-1"><section class="not-found"><p class="kicker">404 / Route not found</p><h1>Nothing here.</h1><p>The old module launcher is retired. WizardGang is a portfolio; Shark Tank and Hexframe live at their own product boundaries.</p><div class="button-row"><a class="button button-primary" href="/work/">View work <span aria-hidden="true">→</span></a><a class="button" href="/">Home</a></div></section></main>`;
  return document({ title: "Not Found — WizardGang", description: "That WizardGang portfolio page does not exist.", path: "/404/", body, build, noindex: true });
}

export function createPages(build) {
  return new Map([
    ["index.html", home(build)],
    ["work/index.html", work(build)],
    ...projects.map((project) => [`work/${project.slug}/index.html`, projectPage(project, build)]),
    ["professional/index.html", professional(build)],
    ["about/index.html", about(build)],
    ["resume/index.html", resume(build)],
    ["404.html", notFound(build)]
  ]);
}

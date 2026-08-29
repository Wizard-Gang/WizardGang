import { projects } from "./projects.mjs";

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
    ["work", "/work/", "Work"],
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
  return `<footer class="site-footer"><span>WizardGang · software systems</span><span>Build <a href="/version.json">${escapeHtml(build.commit)}</a> · 2026</span></footer>`;
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

const tags = (items) => `<ul class="tags" aria-label="Technologies">${items.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>`;

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

function hexframeVisual() {
  return `<div class="project-visual sim-visual hexframe-preview" role="img" aria-label="Hexframe mini training lab cycling attacks with hitboxes, hurtboxes, and an 18-frame timeline">
    <style>
      .hexframe-preview{display:block;padding:0;background:#090a0e}.hexframe-preview svg{display:block;width:100%;height:auto;min-height:420px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.hexframe-preview .hg{stroke:#ffffff12}.hexframe-preview .hl{fill:#b5b0bb;font-size:11px;font-weight:800;letter-spacing:1.4px}.hexframe-preview .ht{fill:#f5f2e9;font-size:15px;font-weight:900}.hexframe-preview .ha{fill:#d9ff43}.hexframe-preview .body{fill:#17171e;stroke:#f5f2e9;stroke-width:3}.hexframe-preview .limb{stroke:#f5f2e9;stroke-width:8;stroke-linecap:round}.hexframe-preview .hurt{fill:#78e8ff28;stroke:#78e8ff;stroke-width:2}.hexframe-preview .hit{fill:#ff5a6f33;stroke:#ff5a6f;stroke-width:2}.hexframe-preview .fn{fill:#85808c;font-size:8px;text-anchor:middle}.hexframe-preview .phase{fill:#b5b0bb;font-size:9px;font-weight:800;text-anchor:middle;letter-spacing:1px}.hexframe-preview .cursor{fill:#d9ff4326;stroke:#d9ff43;stroke-width:2}@media(prefers-reduced-motion:reduce){.hexframe-preview animate,.hexframe-preview animateTransform{display:none}.hexframe-preview .later{opacity:0}}
    </style>
    <svg viewBox="0 0 720 420" aria-hidden="true" focusable="false">
      <defs><pattern id="hfg" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" class="hg"/></pattern></defs><rect width="720" height="420" fill="url(#hfg)"/><text x="24" y="31" class="hl ha">HEXFRAME // MINI LAB</text><text x="696" y="31" class="hl" text-anchor="end">HITBOX + HURTBOX // 60 HZ</text><line x1="24" y1="300" x2="696" y2="300" stroke="#ffffff38" stroke-width="2"/>
      <g transform="translate(205)"><rect x="-34" y="126" width="68" height="116" rx="18" class="hurt"/><circle cx="0" cy="111" r="22" class="body"/><rect x="-22" y="134" width="44" height="78" rx="14" class="body"/><line x1="-10" y1="208" x2="-28" y2="282" class="limb"/><line x1="12" y1="208" x2="33" y2="282" class="limb"/><line x1="-18" y1="150" x2="-48" y2="176" class="limb"/>
        <g><animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite" values="-10 0;-10 0;12 0;12 0;0 0;0 0" keyTimes="0;.22;.23;.42;.58;1"/>
          <g><animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="1;0;0;0;0;0;1" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/><line x1="16" y1="150" x2="82" y2="153" class="limb"/><rect x="70" y="132" width="72" height="44" rx="4" class="hit"><animate attributeName="opacity" dur="4s" repeatCount="indefinite" calcMode="discrete" values="0;0;1;1;0;0" keyTimes="0;.22;.23;.42;.43;1"/></rect></g>
          <g class="later"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="0;1;0;0;0;0;0" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/><line x1="16" y1="145" x2="104" y2="126" class="limb"/><rect x="86" y="96" width="98" height="66" rx="4" class="hit"><animate attributeName="opacity" dur="4s" repeatCount="indefinite" calcMode="discrete" values="0;0;1;1;0;0" keyTimes="0;.28;.29;.46;.47;1"/></rect></g>
          <g class="later"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="0;0;1;0;0;0;0" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/><line x1="16" y1="178" x2="88" y2="214" class="limb"/><rect x="74" y="196" width="92" height="44" rx="4" class="hit"><animate attributeName="opacity" dur="4s" repeatCount="indefinite" calcMode="discrete" values="0;0;1;1;0;0" keyTimes="0;.2;.21;.38;.39;1"/></rect></g>
          <g class="later"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="0;0;0;1;0;0;0" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/><line x1="16" y1="145" x2="96" y2="92" class="limb"/><rect x="82" y="66" width="100" height="62" rx="4" class="hit"><animate attributeName="opacity" dur="4s" repeatCount="indefinite" calcMode="discrete" values="0;0;1;1;0;0" keyTimes="0;.26;.27;.45;.46;1"/></rect></g>
          <g class="later"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="0;0;0;0;1;0;0" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/><line x1="16" y1="150" x2="106" y2="150" class="limb"/><rect x="76" y="104" width="154" height="90" rx="6" class="hit"><animate attributeName="opacity" dur="4s" repeatCount="indefinite" calcMode="discrete" values="0;0;1;1;0;0" keyTimes="0;.32;.33;.55;.56;1"/></rect></g>
          <g class="later"><animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="0;0;0;0;0;1;0" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/><line x1="16" y1="142" x2="76" y2="128" class="limb"/><line x1="16" y1="162" x2="76" y2="180" class="limb"/><rect x="66" y="116" width="82" height="76" rx="6" class="hit"><animate attributeName="opacity" dur="4s" repeatCount="indefinite" calcMode="discrete" values="0;0;1;1;0;0" keyTimes="0;.24;.25;.42;.43;1"/></rect></g>
        </g>
      </g>
      <g transform="translate(492)"><rect x="-34" y="126" width="68" height="116" rx="18" class="hurt"/><circle cx="0" cy="111" r="22" class="body"/><rect x="-22" y="134" width="44" height="78" rx="14" class="body"/><line x1="-10" y1="208" x2="-28" y2="282" class="limb"/><line x1="12" y1="208" x2="33" y2="282" class="limb"/><line x1="-18" y1="150" x2="-58" y2="172" class="limb"/><line x1="18" y1="150" x2="54" y2="174" class="limb"/></g><text x="492" y="291" class="hl" text-anchor="middle">TRAINING DUMMY</text>
      <g class="ht"><text x="24" y="58">5L // QUICK STRIKE<animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="1;0;0;0;0;0;1" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/></text><text x="24" y="58" class="later">5H // HEAVY STRIKE<animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="0;1;0;0;0;0;0" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/></text><text x="24" y="58" class="later">2L // LOW STRIKE<animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="0;0;1;0;0;0;0" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/></text><text x="24" y="58" class="later">J.H // AIR HEAVY<animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="0;0;0;1;0;0;0" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/></text><text x="24" y="58" class="later">236H // SPECIAL<animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="0;0;0;0;1;0;0" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/></text><text x="24" y="58" class="later">THROW // COMMAND GRAB<animate attributeName="opacity" dur="24s" repeatCount="indefinite" calcMode="discrete" values="0;0;0;0;0;1;0" keyTimes="0;.1667;.3333;.5;.6667;.8333;1"/></text></g>
      <g transform="translate(24 320)"><text y="10" class="hl">FRAME</text><g transform="translate(58)"><rect y="-4" width="612" height="29" rx="3" fill="#0f0f14" stroke="#313038"/><rect y="-4" width="170" height="29" fill="#a489ff30"/><rect x="170" y="-4" width="102" height="29" fill="#ff5a6f38"/><rect x="272" y="-4" width="340" height="29" fill="#78e8ff24"/><rect y="-4" width="34" height="29" class="cursor"><animate attributeName="x" dur="4s" repeatCount="indefinite" calcMode="discrete" values="0;34;68;102;136;170;204;238;272;306;340;374;408;442;476;510;544;578" keyTimes="0;.0588;.1176;.1764;.2353;.2941;.3529;.4118;.4706;.5294;.5882;.6471;.7059;.7647;.8235;.8824;.9412;1"/></rect><g class="fn"><text x="17" y="14">01</text><text x="51" y="14">02</text><text x="85" y="14">03</text><text x="119" y="14">04</text><text x="153" y="14">05</text><text x="187" y="14">06</text><text x="221" y="14">07</text><text x="255" y="14">08</text><text x="289" y="14">09</text><text x="323" y="14">10</text><text x="357" y="14">11</text><text x="391" y="14">12</text><text x="425" y="14">13</text><text x="459" y="14">14</text><text x="493" y="14">15</text><text x="527" y="14">16</text><text x="561" y="14">17</text><text x="595" y="14">18</text></g><text x="85" y="45" class="phase">STARTUP 05</text><text x="221" y="45" class="phase">ACTIVE 03</text><text x="442" y="45" class="phase">RECOVERY 10</text></g></g>
      <g transform="translate(24 392)"><rect width="10" height="10" class="hurt"/><text x="17" y="9" class="hl">HURTBOX</text><rect x="92" width="10" height="10" class="hit"/><text x="109" y="9" class="hl">HITBOX</text><text x="696" y="9" class="hl" text-anchor="end">LAB VISUAL // DETERMINISTIC SYSTEMS</text></g>
    </svg>
  </div>`;
}

function projectVisual(project) {
  if (project.slug === "sharktank") {
    return `<div class="project-visual shark-preview" role="img" aria-label="Animated Shark Tank gameplay preview with ISO 27001 and ISO 42001 governance controls">
      <div class="shark-game">
        <div class="shark-hud"><strong>TANK 03</strong><span>LIVE SIMULATION</span><em>08 ACTIVE</em></div>
        <div class="tank-tabs" aria-hidden="true"><span>01</span><span>02</span><span class="active">03</span><span>04</span></div>
        <svg viewBox="0 0 800 330" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="tankWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#153e50"/><stop offset="1" stop-color="#07151d"/></linearGradient>
            <linearGradient id="sharkBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9bb8c3"/><stop offset="1" stop-color="#536f7a"/></linearGradient>
          </defs>
          <rect width="800" height="330" fill="url(#tankWater)"/>
          <path d="M0 58 C110 42 210 72 330 54 S560 35 800 61" fill="none" stroke="#78e8ff" stroke-opacity=".22" stroke-width="3"/>
          <path d="M0 92 C150 111 260 74 410 96 S650 116 800 88" fill="none" stroke="#78e8ff" stroke-opacity=".1" stroke-width="2"/>
          <g fill="#78e8ff" fill-opacity=".32"><circle cx="84" cy="252" r="4"/><circle cx="100" cy="226" r="2"/><circle cx="686" cy="266" r="5"/><circle cx="706" cy="236" r="2"/><circle cx="575" cy="86" r="3"/><circle cx="592" cy="62" r="2"/></g>
          <g class="food" fill="#d9ff43"><circle cx="430" cy="208" r="5"/><circle cx="446" cy="199" r="3"/><circle cx="463" cy="215" r="4"/></g>
          <g class="shark shark-a">
            <polygon points="205,126 157,101 165,129 157,157" fill="#536f7a"/>
            <ellipse cx="248" cy="129" rx="58" ry="27" fill="url(#sharkBody)"/>
            <polygon points="243,105 263,72 278,111" fill="#6f8993"/>
            <polygon points="248,151 271,178 286,145" fill="#5f7b86"/>
            <circle cx="284" cy="121" r="4" fill="#08080b"/>
            <path d="M294 135 q18 8 28 -2" fill="none" stroke="#263b43" stroke-width="3" stroke-linecap="round"/>
          </g>
          <g class="shark shark-b">
            <polygon points="488,234 534,210 528,236 535,263" fill="#536f7a"/>
            <ellipse cx="447" cy="236" rx="54" ry="25" fill="#839da7"/>
            <polygon points="449,214 432,186 417,219" fill="#667f89"/>
            <circle cx="412" cy="229" r="4" fill="#08080b"/>
            <path d="M401 242 q-16 7 -25 -2" fill="none" stroke="#263b43" stroke-width="3" stroke-linecap="round"/>
          </g>
          <g class="shark shark-c">
            <polygon points="594,141 558,121 563,143 558,163" fill="#3f5d68"/>
            <ellipse cx="627" cy="143" rx="44" ry="21" fill="#6f8c97"/>
            <polygon points="628,125 641,100 652,129" fill="#587480"/>
            <circle cx="653" cy="137" r="3" fill="#08080b"/>
          </g>
          <g class="small-fish" fill="#d9ff43" fill-opacity=".8"><path d="M344 180 l18 -9 v18 z"/><ellipse cx="372" cy="180" rx="15" ry="8"/><path d="M110 196 l15 -7 v14 z"/><ellipse cx="134" cy="196" rx="12" ry="7"/></g>
          <path d="M0 300 C150 282 290 318 430 296 S670 281 800 302 V330 H0Z" fill="#071015"/>
        </svg>
        <div class="shark-status"><span>ROOM AUTHORITY / DURABLE OBJECT</span><span>STATE SYNCED</span></div>
      </div>
      <div class="shark-governance">
        <span><strong>ISO/IEC 27001</strong><small>Security controls</small></span>
        <span><strong>ISO/IEC 42001</strong><small>AI governance</small></span>
        <span><strong>LIVE EVIDENCE</strong><small>Risk · incidents · change</small></span>
        <span><strong>RECOVERY</strong><small>Backups · restore drills</small></span>
      </div>
      <style>
        .shark-preview{display:grid;grid-template-rows:minmax(0,1fr) auto;padding:0;background:#071015}.shark-preview::before{display:none}.shark-game{position:relative;min-height:330px;overflow:hidden;background:#07151d}.shark-game::after{position:absolute;inset:0;background:linear-gradient(110deg,transparent 0 42%,rgb(120 232 255 / 7%) 48%,transparent 54%);content:"";animation:tank-shimmer 6s linear infinite;pointer-events:none}.shark-game svg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.shark-hud,.shark-status,.tank-tabs{position:absolute;z-index:2;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;text-transform:uppercase}.shark-hud{top:1rem;left:1rem;display:flex;align-items:center;gap:.75rem;padding:.55rem .7rem;border:1px solid rgb(120 232 255 / 38%);background:rgb(7 16 21 / 78%);backdrop-filter:blur(6px)}.shark-hud strong{color:#78e8ff;font-size:.73rem;letter-spacing:.08em}.shark-hud span,.shark-hud em{color:#b5b0bb;font-size:.58rem;font-style:normal;letter-spacing:.06em}.shark-hud em{color:#d9ff43}.tank-tabs{top:1rem;right:1rem;display:flex;gap:.3rem}.tank-tabs span{display:grid;place-items:center;width:2rem;height:1.75rem;border:1px solid rgb(255 255 255 / 14%);background:rgb(7 16 21 / 70%);color:#85808c;font-size:.58rem;font-weight:800}.tank-tabs .active{border-color:#d9ff43;color:#d9ff43;box-shadow:0 0 16px rgb(217 255 67 / 16%)}.shark-status{right:1rem;bottom:.8rem;left:1rem;display:flex;justify-content:space-between;gap:1rem;color:#9ab0b8;font-size:.55rem;letter-spacing:.06em}.shark-status span:last-child{color:#d9ff43}.shark-governance{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid #31434a;background:#0a0f13}.shark-governance span{display:flex;min-height:82px;flex-direction:column;justify-content:center;padding:.85rem 1rem;border-right:1px solid #27353b}.shark-governance span:last-child{border-right:0}.shark-governance strong{color:#f5f2e9;font:800 .62rem/1.25 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.04em}.shark-governance span:nth-child(-n+2) strong{color:#78e8ff}.shark-governance small{margin-top:.28rem;color:#85808c;font:600 .54rem/1.3 ui-monospace,SFMono-Regular,Consolas,monospace}.shark{transform-box:fill-box;transform-origin:center}.shark-a{animation:swim-a 7s ease-in-out infinite alternate}.shark-b{animation:swim-b 8.5s ease-in-out infinite alternate}.shark-c{animation:swim-c 6s ease-in-out infinite alternate}.small-fish{animation:fish-drift 5.5s ease-in-out infinite alternate}.food{animation:food-pulse 1.2s ease-in-out infinite alternate}@keyframes swim-a{from{transform:translate(-70px,12px)}to{transform:translate(150px,-18px)}}@keyframes swim-b{from{transform:translate(105px,-12px)}to{transform:translate(-135px,18px)}}@keyframes swim-c{from{transform:translate(-55px,-8px)}to{transform:translate(70px,14px)}}@keyframes fish-drift{from{transform:translateX(-25px)}to{transform:translateX(55px)}}@keyframes food-pulse{from{opacity:.45;transform:scale(.86)}to{opacity:1;transform:scale(1.08)}}@keyframes tank-shimmer{from{transform:translateX(-70%)}to{transform:translateX(70%)}}@media(max-width:700px){.shark-governance{grid-template-columns:repeat(2,minmax(0,1fr))}.shark-governance span:nth-child(2){border-right:0}.shark-governance span:nth-child(-n+2){border-bottom:1px solid #27353b}.tank-tabs{display:none}.shark-hud span{display:none}}@media(prefers-reduced-motion:reduce){.shark-game::after,.shark,.small-fish,.food{animation:none!important}}
      </style>
    </div>`;
  }
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
    <section class="hero"><div><p class="kicker">Independent software engineering</p><h1>Software systems <span>built to hold up.</span></h1></div><div class="hero-side"><p>I design and build software across application, platform, security, and operations—from architecture through deployment and production evidence.</p><p class="hero-meta">TypeScript · Cloudflare · Security · APIs · Automation · Simulation</p><div class="button-row"><a class="button button-primary" href="/work/">View work <span aria-hidden="true">→</span></a><a class="button" href="/resume/">Resume</a></div></div></section>
    <section class="work-preview" aria-labelledby="selected-work"><div class="section-heading"><div><p class="kicker">Selected work</p><h2 id="selected-work">Three focused case studies.</h2></div><span>03 PROJECTS</span></div>${projects.map(projectCard).join("")}</section>
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
  const body = `<main class="case-main" id="main" tabindex="-1"><section class="page-hero"><p class="kicker">Selected work</p><h1>Governance.<br><span>Simulation. Portability.</span></h1><p>Three case studies with different jobs: Shark Tank demonstrates governed production operations, Hexframe demonstrates deterministic software architecture, and YarReader demonstrates reliable offline tooling.</p></section><section class="work-list" aria-label="Projects">${projects.map(projectCard).join("")}</section></main>`;
  return document({ title: "Work — WizardGang Software Portfolio", description: "Selected WizardGang work: Shark Tank, Hexframe, and YarReader.", path: "/work/", current: "work", body, build });
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
  const body = `<main class="case-main" id="main" tabindex="-1"><section class="page-hero about-hero"><p class="kicker">About WizardGang</p><h1>Build the whole path.<br><span>Explain the hard parts.</span></h1><div class="prose"><p>WizardGang is an independent software engineering practice focused on useful products with rigorous foundations. The work spans governed production systems, deterministic simulation, portable data pipelines, APIs, identity boundaries, automation, and operations.</p><p>I work hands-on from requirements and domain models through implementation, deployment, and production evidence. The aim is the smallest sound architecture with explicit ownership, failure behavior, security boundaries, and enough evidence for another person to understand what the system actually does.</p></div><div class="button-row"><a class="button button-primary" href="/work/">View work <span aria-hidden="true">→</span></a><a class="button" href="${GITHUB}">GitHub <span aria-hidden="true">↗</span></a></div></section></main>`;
  return document({ title: "About — WizardGang Software Engineering", description: "About WizardGang, an independent software engineering practice working across product, application, security, platform, and operations.", path: "/about/", current: "about", body, build });
}

function resume(build) {
  const body = `<main class="case-main" id="main" tabindex="-1"><section class="page-hero resume-hero"><p class="kicker">Resume / selected experience</p><h1>Systems builder.</h1><p>Product-minded engineering across security and AI governance, deterministic simulation, realtime edge services, durable data pipelines, identity boundaries, automation, and production operations.</p></section>
    <section class="resume-section" aria-labelledby="resume-projects"><p class="kicker">Selected project experience</p><h2 id="resume-projects">Built end to end.</h2>
      ${projects.map((project) => `<article class="resume-entry"><div><strong>${escapeHtml(project.name)}</strong><span>${escapeHtml(project.eyebrow)}</span></div><div><h3>${escapeHtml(project.description)}</h3><ul>${project.built.slice(0, 2).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><a class="text-link" href="/work/${project.slug}/">Case study <span aria-hidden="true">→</span></a></div></article>`).join("")}
    </section>
    <section class="resume-section" aria-labelledby="resume-strengths"><p class="kicker">Core strengths</p><h2 id="resume-strengths">Architecture with a product surface.</h2><div class="strength-grid"><div><strong>System design</strong><span>Domain models, invariants, ownership, and failure recovery.</span></div><div><strong>TypeScript</strong><span>Browser apps, Workers, APIs, protocols, CLIs, and tooling.</span></div><div><strong>Cloudflare</strong><span>Workers, Durable Objects, R2, routing, deployment, and operations.</span></div><div><strong>Security &amp; governance</strong><span>Risk, controls, evidence, identity, incident response, and AI governance.</span></div><div><strong>Automation</strong><span>Durable workflows, integrations, AI proposals, and human review.</span></div><div><strong>Operations</strong><span>Observability, cost limits, changes, incidents, backups, and drills.</span></div></div></section>
    <section class="explore"><p class="kicker">Project record</p><h2>The work is designed to be inspectable.</h2><div class="button-row"><a class="button button-primary" href="/work/">View selected work <span aria-hidden="true">→</span></a><a class="button" href="${GITHUB}">GitHub <span aria-hidden="true">↗</span></a></div></section>
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
    ["about/index.html", about(build)],
    ["resume/index.html", resume(build)],
    ["404.html", notFound(build)]
  ]);
}

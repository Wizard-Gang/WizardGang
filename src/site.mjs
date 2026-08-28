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
  const links = [`<a class="${compact ? "text-link" : "button button-primary"}" href="/work/${project.slug}/">${compact ? "Case study" : "View project"} <span aria-hidden="true">→</span></a>`];
  if (project.liveUrl) links.push(`<a class="${compact ? "text-link" : "button"}" href="${project.liveUrl}">${project.slug === "sharktank" ? "Play" : "Live demo"} <span aria-hidden="true">↗</span></a>`);
  if (project.operationsUrl) links.push(`<a class="${compact ? "text-link" : "button"}" href="${project.operationsUrl}">Operations <span aria-hidden="true">↗</span></a>`);
  if (project.sourcePublic && project.sourceUrl) links.push(`<a class="${compact ? "text-link" : "button"}" href="${project.sourceUrl}">Source <span aria-hidden="true">↗</span></a>`);
  return `<div class="${compact ? "text-links" : "button-row"}">${links.join("")}</div>`;
}

function projectVisual(project) {
  if (project.slug === "hexframe") {
    return `<div class="project-visual sim-visual" role="img" aria-label="Hexframe deterministic simulation flow"><strong>60<small>HZ INTEGER SIMULATION</small></strong><div><span>Input</span><span>Simulation</span><span>Snapshots</span><span>Renderer</span></div></div>`;
  }
  if (project.slug === "yarreader") {
    return `<div class="project-visual archive-visual" role="img" aria-label="YarReader verified archive and portable export flow"><header><strong>YAR / PIPELINE</strong><span>ATOMIC GENERATION 001</span></header><div class="archive-files"><span><b>CBZ / CBR</b><em>source verified</em><code>e3b0c4…98fc</code></span><span><b>EPUB / PDF</b><em>pages normalized</em><code>WEBP / v1</code></span><span><b>STATIC HTML</b><em>export activated</em><code>NO SERVER</code></span></div><footer><span>Crash recoverable</span><span>Content addressed</span><span>Portable</span></footer></div>`;
  }
  return `<div class="project-visual edge-visual" role="img" aria-label="Shark Tank realtime edge architecture"><header><strong>SHARK TANK / LIVE</strong><span>FOUR REALTIME ROOMS</span></header><div class="edge-map"><span>Tank 01</span><span>Tank 02</span><span>Tank 03</span><span>Tank 04</span><b>Durable state · WebSockets · Worker edge</b></div><footer><span>Observability</span><span>Cost controls</span><span>Incident response</span><span>Security</span></footer></div>`;
}

function projectCard(project, index) {
  return `<article class="project-row${index % 2 ? " project-row-reverse" : ""}">
    <div class="project-copy"><span class="project-number">${project.number} / ${escapeHtml(project.eyebrow)}</span><h3><a href="/work/${project.slug}/">${escapeHtml(project.name)}</a></h3><p>${escapeHtml(project.description)}</p>${tags(project.tags.slice(0, 5))}${actions(project, true)}</div>
    ${projectVisual(project)}
  </article>`;
}

function home(build) {
  const body = `<main class="site-main" id="main" tabindex="-1">
    <section class="hero"><div><p class="kicker">Independent software engineering</p><h1>Software systems <span>built to hold up.</span></h1></div><div class="hero-side"><p>I take products from a clear model through implementation, deployment, and the evidence that makes production behavior understandable.</p><p class="hero-meta">TypeScript · Cloudflare · APIs · Automation · Games · Identity</p><div class="button-row"><a class="button button-primary" href="/work/">View work <span aria-hidden="true">→</span></a><a class="button" href="/resume/">Resume</a></div></div></section>
    <section class="work-preview" aria-labelledby="selected-work"><div class="section-heading"><div><p class="kicker">Selected work</p><h2 id="selected-work">Systems, not samples.</h2></div><span>03 PROJECTS</span></div>${projects.map(projectCard).join("")}</section>
    <section class="capabilities" aria-labelledby="capabilities-heading"><div class="section-heading"><div><p class="kicker">Capabilities</p><h2 id="capabilities-heading">Across product and platform.</h2></div></div><div class="capability-grid">
      <article><small>01</small><h3>Full-stack TypeScript</h3><p>Browser applications, edge services, CLIs, protocols, and test tooling.</p></article>
      <article><small>02</small><h3>Cloudflare / edge</h3><p>Workers, Durable Objects, storage, routing, deployment, and recovery.</p></article>
      <article><small>03</small><h3>REST &amp; web services</h3><p>Resource models, API contracts, validation, integrations, and observability.</p></article>
      <article><small>04</small><h3>Identity &amp; access</h3><p>OAuth, OIDC, SSO, RBAC, service authentication, and trust boundaries.</p></article>
      <article><small>05</small><h3>Data &amp; automation</h3><p>SQL models, content pipelines, durable workflows, and integrations.</p></article>
      <article><small>06</small><h3>Deterministic systems</h3><p>Simulation, rollback, state machines, AI behavior, and authored tools.</p></article>
      <article><small>07</small><h3>Security &amp; DevOps</h3><p>Controls, incident response, testing, delivery, cost limits, and evidence.</p></article>
      <article><small>08</small><h3>AI-assisted engineering</h3><p>Schema-bound proposals, agent workflows, review, and reproducible decisions.</p></article>
    </div></section>
    <section class="about-teaser" aria-labelledby="about-teaser-heading"><div><p class="kicker">About</p><h2 id="about-teaser-heading">Make the hard parts legible.</h2></div><div><p>WizardGang is an independent software practice focused on systems that are useful at the surface and rigorous underneath. I work across product, application, platform, and operational boundaries—choosing a clean model, building the full path, and leaving evidence that the system behaves as claimed.</p><a class="text-link" href="/about/">More about the work <span aria-hidden="true">→</span></a></div></section>
  </main>`;
  return document({ title: "WizardGang — Software Engineering Portfolio", description: "WizardGang builds TypeScript, Cloudflare, API, automation, identity, and game systems from product concept through production.", path: "/", body, build, social: true });
}

function work(build) {
  const body = `<main class="case-main" id="main" tabindex="-1"><section class="page-hero"><p class="kicker">Selected work</p><h1>Three systems.<br><span>Three different constraints.</span></h1><p>Each case study is a short route into the product. The repositories and live deployments carry the deeper technical evidence when they are public and ready.</p></section><section class="work-list" aria-label="Projects">${projects.map(projectCard).join("")}</section></main>`;
  return document({ title: "Work — WizardGang Software Portfolio", description: "Selected WizardGang work: Hexframe, YarReader, and Shark Tank.", path: "/work/", current: "work", body, build });
}

function architecture(items) {
  return `<div class="architecture">${items.map(([name, detail]) => `<div><strong>${escapeHtml(name)}</strong><span>${escapeHtml(detail)}</span></div>`).join("")}</div>`;
}

function projectPage(project, build) {
  const title = project.slug === "hexframe"
    ? "Hexframe — Deterministic Fighting Game Systems | WizardGang"
    : project.slug === "yarreader"
      ? "YarReader — Portable Media Pipeline | WizardGang"
      : "Shark Tank — Cloudflare Real-Time Systems | WizardGang";
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
  const body = `<main class="case-main" id="main" tabindex="-1"><section class="page-hero about-hero"><p class="kicker">About WizardGang</p><h1>Build the whole path.<br><span>Explain the hard parts.</span></h1><div class="prose"><p>WizardGang is an independent software engineering practice focused on useful products with rigorous foundations. The work spans deterministic games, realtime edge services, crash-recoverable pipelines, APIs, identity boundaries, automation, and the controls that make production systems understandable.</p><p>I work hands-on from requirements and domain models through implementation, deployment, and operations. The aim is not to accumulate technology. It is to choose the smallest sound architecture, make ownership and failure behavior explicit, and leave enough evidence for another person to understand what the system actually does.</p></div><div class="button-row"><a class="button button-primary" href="/work/">View work <span aria-hidden="true">→</span></a><a class="button" href="${GITHUB}">GitHub <span aria-hidden="true">↗</span></a></div></section></main>`;
  return document({ title: "About — WizardGang Software Engineering", description: "About WizardGang, an independent software engineering practice working across product, application, platform, and operations.", path: "/about/", current: "about", body, build });
}

function resume(build) {
  const body = `<main class="case-main" id="main" tabindex="-1"><section class="page-hero resume-hero"><p class="kicker">Resume / selected experience</p><h1>Systems builder.</h1><p>Product-minded engineering across deterministic simulation, realtime edge services, durable data pipelines, identity boundaries, AI-assisted workflows, and production operations.</p></section>
    <section class="resume-section" aria-labelledby="resume-projects"><p class="kicker">Selected project experience</p><h2 id="resume-projects">Built end to end.</h2>
      ${projects.map((project) => `<article class="resume-entry"><div><strong>${escapeHtml(project.name)}</strong><span>${escapeHtml(project.eyebrow)}</span></div><div><h3>${escapeHtml(project.description)}</h3><ul>${project.built.slice(0, 2).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><a class="text-link" href="/work/${project.slug}/">Case study <span aria-hidden="true">→</span></a></div></article>`).join("")}
    </section>
    <section class="resume-section" aria-labelledby="resume-strengths"><p class="kicker">Core strengths</p><h2 id="resume-strengths">Architecture with a product surface.</h2><div class="strength-grid"><div><strong>System design</strong><span>Domain models, invariants, ownership, and failure recovery.</span></div><div><strong>TypeScript</strong><span>Browser apps, Workers, APIs, protocols, CLIs, and tooling.</span></div><div><strong>Cloudflare</strong><span>Workers, Durable Objects, R2, routing, deployment, and operations.</span></div><div><strong>Identity</strong><span>OAuth/OIDC, SSO, RBAC, service accounts, and trust boundaries.</span></div><div><strong>Automation</strong><span>Durable workflows, integrations, AI proposals, and human review.</span></div><div><strong>Operations</strong><span>Security, observability, cost limits, incidents, backups, and drills.</span></div></div></section>
    <section class="explore"><p class="kicker">Project record</p><h2>The work is designed to be inspectable.</h2><div class="button-row"><a class="button button-primary" href="/work/">View selected work <span aria-hidden="true">→</span></a><a class="button" href="${GITHUB}">GitHub <span aria-hidden="true">↗</span></a></div></section>
  </main>`;
  return document({ title: "Resume — WizardGang Software Engineering", description: "WizardGang project experience across TypeScript, Cloudflare, APIs, identity, automation, deterministic systems, and production operations.", path: "/resume/", current: "resume", body, build });
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

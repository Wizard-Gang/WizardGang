import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { professionalRoles } from "../src/professional.mjs";
import { deployments, integrationGroups, systemGroups } from "../src/professional-systems.mjs";

const GITHUB = "https://github.com/SouthernGentlemen";
const LINKEDIN = "https://www.linkedin.com/in/jacob-yongue";
const CONTACT_EMAIL = "jacobyongue@outlook.com";

const escapeHtml = (value) => String(value).replace(/[&<>\"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;"
})[character]);

function replaceRequired(source, pattern, replacement, label) {
  const next = source.replace(pattern, replacement);
  if (next === source) throw new Error(`portfolio cleanup could not locate ${label}`);
  return next;
}

function externalReference(item) {
  if (!item.url) return escapeHtml(item.name);
  return `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)} <span class="sr-only">(opens in a new tab)</span></a>`;
}

function referenceCloud(items, className = "reference-cloud") {
  return `<ul class="${className}">${items.map((item) => `<li>${externalReference(item)}</li>`).join("")}</ul>`;
}

function capabilityCloud(items) {
  return `<ul class="capability-cloud">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function professionalSystemsSection() {
  const integrations = integrationGroups.map((group) => `<article class="proof-group"><h4>${escapeHtml(group.title)}</h4>${referenceCloud(group.items)}</article>`).join("");
  const systems = systemGroups.map((group) => `<article class="proof-group"><h4>${escapeHtml(group.title)}</h4>${capabilityCloud(group.items)}</article>`).join("");

  return `<section id="professional" class="professional-proof" aria-labelledby="professional-heading">
    <header><div><p class="kicker">Professional systems</p><h2 id="professional-heading">Production systems.</h2></div><p>Warehouse, fulfillment, logistics, justice, public-sector, and enterprise software delivered from requirements through production.</p></header>
    <div class="proof-block"><h3>Deployments</h3>${referenceCloud(deployments)}</div>
    <div class="proof-block"><h3>Integrations</h3><div class="integration-grid">${integrations}</div></div>
    <div class="proof-block"><h3>Systems</h3><div class="system-grid">${systems}</div></div>
  </section>`;
}

function experienceSection() {
  const softwareRoles = professionalRoles.filter((role) => role.organization !== "Independent venture");
  return `<section class="experience-proof" aria-labelledby="experience-heading">
    <header><div><p class="kicker">Experience</p><h2 id="experience-heading">Delivery record.</h2></div></header>
    <div class="experience-list">${softwareRoles.map((role) => `<article><span>${escapeHtml(role.dates)}</span><h3>${escapeHtml(role.organization)}</h3><p>${escapeHtml(role.role)}</p></article>`).join("")}</div>
  </section>`;
}

function aboutSection() {
  return `<section id="about" class="about-proof" aria-labelledby="about-heading">
    <header><div><p class="kicker">About</p><h2 id="about-heading">Requirements to production.</h2></div><div><p>I work across requirements, architecture, implementation, testing, deployment, and operational handoff. The public projects show the engineering in detail; the resume carries the complete employment record.</p><div class="button-row"><a class="button button-primary" href="/resume/">Resume <span aria-hidden="true">→</span></a><a class="button" href="mailto:${CONTACT_EMAIL}">Email</a><a class="button" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></div></div></header>
  </section>`;
}

function globalChrome(html, relative) {
  const resumeCurrent = relative === "resume/index.html" ? ' aria-current="page"' : "";
  html = replaceRequired(
    html,
    /<nav class="site-nav" aria-label="Primary">[\s\S]*?<\/nav>/,
    `<nav class="site-nav" aria-label="Primary"><a href="/#projects">Projects</a><a href="/resume/"${resumeCurrent}>Resume</a><a href="${GITHUB}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></nav>`,
    `${relative} primary navigation`
  );
  html = html.replace("WizardGang · independent builds + professional delivery", "WizardGang · software engineering portfolio");
  html = html.replace(/← Selected work/g, "← Projects");
  html = html.replace(/>Case study <span/g, ">Project <span");
  return html;
}

function cleanHome(html) {
  const hero = `<section class="hero"><div><p class="kicker">Software engineering</p><h1>Systems built <span>from requirements to production.</span></h1></div><div class="hero-side"><p>Independent software and production delivery across realtime systems, warehouse and fulfillment operations, enterprise integrations, justice systems, and governance.</p><p class="hero-meta">TypeScript · .NET · Python · SQL · Cloudflare · APIs · WMS/ERP · EDI</p><div class="button-row"><a class="button button-primary" href="/#projects">Projects <span aria-hidden="true">↓</span></a><a class="button" href="/resume/">Resume</a><a class="button" href="${GITHUB}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div></div></section>`;

  html = replaceRequired(html, /<section class="hero">[\s\S]*?<\/section>/, hero, "homepage hero");
  html = replaceRequired(html, /\s*<section class="work-tracks"[\s\S]*?<\/section>/, "", "work-track taxonomy");
  html = replaceRequired(html, '<section class="work-preview" aria-labelledby="selected-work">', '<section id="projects" class="work-preview" aria-labelledby="selected-work">', "projects anchor");
  html = replaceRequired(
    html,
    /<div class="section-heading"><div><p class="kicker">Independent build lab<\/p><h2 id="selected-work">Three focused case studies\.<\/h2><\/div><span>03 PROJECTS<\/span><\/div>/,
    '<div class="section-heading"><div><p class="kicker">Projects</p><h2 id="selected-work">Shipped systems.</h2></div><span>03 PROJECTS</span></div>',
    "project heading"
  );
  html = replaceRequired(html, /\s*<section class="capabilities"[\s\S]*?<\/section>/, "", "generic capability section");
  html = replaceRequired(
    html,
    /<section class="about-teaser"[\s\S]*?<\/section>/,
    `${professionalSystemsSection()}${experienceSection()}${aboutSection()}`,
    "about teaser"
  );
  return html;
}

function redirectPage(html, { destination, heading, description }) {
  html = replaceRequired(html, /<main[\s\S]*?<\/main>/, `<main class="case-main moved-page" id="main" tabindex="-1"><section><p class="kicker">Moved</p><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p><div class="button-row"><a class="button button-primary" href="${escapeHtml(destination)}">Continue <span aria-hidden="true">→</span></a></div></section></main>`, `${heading} redirect body`);
  html = html.replace("</head>", `    <meta name="robots" content="noindex">\n    <meta http-equiv="refresh" content="0;url=${escapeHtml(destination)}">\n  </head>`);
  return html;
}

export async function applyPortfolioCleanup({ root, dist }) {
  const pages = [
    "index.html",
    "work/index.html",
    "work/sharktank/index.html",
    "work/hexframe/index.html",
    "work/yarreader/index.html",
    "professional/index.html",
    "about/index.html",
    "resume/index.html",
    "404.html"
  ];

  for (const relative of pages) {
    const target = resolve(dist, relative);
    let html = await readFile(target, "utf8");
    html = globalChrome(html, relative);

    if (relative === "index.html") html = cleanHome(html);
    if (relative === "work/index.html") html = redirectPage(html, {
      destination: "/#projects",
      heading: "Projects moved to the homepage.",
      description: "Shark Tank, Hexframe, and YarReader are now part of the main portfolio index. Existing project detail URLs remain unchanged."
    });
    if (relative === "professional/index.html") html = redirectPage(html, {
      destination: "/#professional",
      heading: "Professional systems moved to the homepage.",
      description: "Deployments, integrations, system domains, and the delivery record now live in one canonical portfolio section."
    });
    if (relative === "about/index.html") html = redirectPage(html, {
      destination: "/#about",
      heading: "About moved to the homepage.",
      description: "The portfolio now keeps the short working summary beside the projects and professional systems it describes."
    });

    await writeFile(target, html);
  }

  const stylesTarget = resolve(dist, "assets/styles.css");
  const baseStyles = await readFile(stylesTarget, "utf8");
  const cleanupStyles = await readFile(resolve(root, "src/portfolio-cleanup.css"), "utf8");
  await writeFile(stylesTarget, `${baseStyles.trim()}\n\n/* WG-017 portfolio cleanup */\n${cleanupStyles.trim()}\n`);
}

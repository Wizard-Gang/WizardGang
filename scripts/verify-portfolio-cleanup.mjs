import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deployments, integrationGroups, systemGroups } from "../src/professional-systems.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const failures = [];
const fail = (message) => failures.push(message);
const escapeHtml = (value) => String(value).replace(/[&<>\"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;"
})[character]);

const home = await readFile(resolve(dist, "index.html"), "utf8");

for (const anchor of ['id="projects"', 'id="professional"', 'id="about"']) {
  if (!home.includes(anchor)) fail(`homepage missing ${anchor}`);
}

for (const phrase of [
  "Two bodies of work",
  "Different contexts. Clear boundaries.",
  "Independent build lab",
  "Three focused case studies.",
  "Core engineering scope.",
  "Independent engineering practice."
]) {
  if (home.includes(phrase)) fail(`homepage still contains retired taxonomy/copy: ${phrase}`);
}

for (const project of ["Shark Tank", "Hexframe", "YarReader"]) {
  if (!home.includes(project)) fail(`homepage missing project ${project}`);
}

for (const item of deployments) {
  const name = escapeHtml(item.name);
  if (!home.includes(`>${name}`)) fail(`homepage missing deployment ${item.name}`);
  if (item.url && !home.includes(`href="${item.url}"`)) fail(`homepage missing official deployment link for ${item.name}`);
}

for (const group of integrationGroups) {
  const title = escapeHtml(group.title);
  if (!home.includes(`>${title}<`)) fail(`homepage missing integration group ${group.title}`);
  for (const item of group.items) {
    const name = escapeHtml(item.name);
    if (!home.includes(`>${name}`)) fail(`homepage missing integration ${item.name}`);
    if (item.url && !home.includes(`href="${item.url}"`)) fail(`homepage missing official integration link for ${item.name}`);
  }
}

for (const group of systemGroups) {
  const title = escapeHtml(group.title);
  if (!home.includes(`>${title}<`)) fail(`homepage missing system group ${group.title}`);
  for (const item of group.items) {
    const name = escapeHtml(item);
    if (!home.includes(`>${name}<`)) fail(`homepage missing system capability ${item}`);
  }
}

if (!home.includes('target="_blank" rel="noopener noreferrer"')) fail("homepage external proof links are missing safe new-tab attributes");
if (!home.includes("Warehouse, fulfillment, logistics, justice, public-sector, and enterprise software delivered from requirements through production.")) {
  fail("homepage missing canonical professional-systems summary");
}

for (const [relative, destination] of [
  ["work/index.html", "/#projects"],
  ["professional/index.html", "/#professional"],
  ["about/index.html", "/#about"]
]) {
  const html = await readFile(resolve(dist, relative), "utf8");
  if (!html.includes(`content="0;url=${destination}"`)) fail(`${relative} missing compatibility redirect to ${destination}`);
  if (!html.includes('name="robots" content="noindex"')) fail(`${relative} compatibility page must be noindex`);
}

const sitemap = await readFile(resolve(dist, "sitemap.xml"), "utf8");
for (const retired of ["/work/</loc>", "/professional/</loc>", "/about/</loc>"]) {
  if (sitemap.includes(retired)) fail(`sitemap still publishes redundant route ${retired}`);
}
for (const required of ["/work/sharktank/", "/work/hexframe/", "/work/yarreader/", "/resume/"]) {
  if (!sitemap.includes(required)) fail(`sitemap missing ${required}`);
}

try {
  await access(resolve(root, "PORTFOLIO_CLEANUP_PROMPT.md"));
  fail("temporary PORTFOLIO_CLEANUP_PROMPT.md must be deleted before WG-017 is complete");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("Verified consolidated homepage taxonomy, professional proof points, compatibility routes, external links, and cleanup-spec removal.");

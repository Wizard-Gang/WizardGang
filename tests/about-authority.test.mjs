import assert from "node:assert/strict";
import test from "node:test";
import { TEAM_MEMBERS } from "../src/data/team.ts";
import { CANONICAL_PAGES, anchors, linkByRel, metaContent, readDist, readRoot, tagBlocks, textContent } from "./helpers.mjs";

const ORIGIN = "https://wizardgang.ai";

const ABOUT_ROUTES = new Map([
  ["about/index.html", "/about/"],
  ["about/company/index.html", "/about/company/"],
  ["about/team/index.html", "/about/team/"],
  ["about/team/jacob/index.html", "/about/team/jacob/"]
]);

test("About route family is canonical, shallow, and globally owned by About", async () => {
  for (const [relative, route] of ABOUT_ROUTES) {
    assert.equal(CANONICAL_PAGES.get(relative), route);

    const html = await readDist(relative);
    assert.equal(tagBlocks(html, "h1").length, 1, `${relative} must have one H1`);

    const primary = tagBlocks(html, "nav").find(({ attrs }) => attrs.get("aria-label") === "Primary");
    assert.ok(primary, `${relative} missing primary navigation`);
    const current = anchors(primary.inner).filter((anchor) => anchor.attrs.get("aria-current") === "page");
    assert.equal(current.length, 1, `${relative} must expose one global current item`);
    assert.equal(current[0].href, "/about/");
  }
});

test("About local navigation keeps Company and Team subordinate to About", async () => {
  const expected = [
    ["About", "/about/"],
    ["Company", "/about/company/"],
    ["Team", "/about/team/"]
  ];

  for (const [relative] of ABOUT_ROUTES) {
    const html = await readDist(relative);
    const local = tagBlocks(html, "nav").find(({ attrs }) => attrs.get("aria-label") === "About section");
    assert.ok(local, `${relative} missing About section navigation`);
    assert.deepEqual(
      anchors(local.inner).map((anchor) => [textContent(anchor.inner), anchor.href]),
      expected,
      `${relative} local About navigation drifted`
    );
  }

  const landing = await readDist("about/index.html");
  assert.ok(anchors(landing).some((anchor) => anchor.href === "/about/company/" && /About the company/i.test(textContent(anchor.inner))));
  assert.ok(anchors(landing).some((anchor) => anchor.href === "/about/team/" && /Meet the team/i.test(textContent(anchor.inner))));

  const jacob = await readDist("about/team/jacob/index.html");
  const local = tagBlocks(jacob, "nav").find(({ attrs }) => attrs.get("aria-label") === "About section");
  const team = anchors(local.inner).find((anchor) => anchor.href === "/about/team/");
  assert.equal(team?.attrs.get("aria-current"), "location");
});

test("Company, Team, and Jacob keep ownership boundaries explicit", async () => {
  const company = textContent(await readDist("about/company/index.html"));
  assert.match(company, /WizardGang is a software organization/);
  assert.match(company, /Employer and customer history is not presented as WizardGang client work/);
  assert.doesNotMatch(company, /University of Georgia|Supply Chain Technologies|FastFetch Corp|Career history|Deployments/);

  const team = textContent(await readDist("about/team/index.html"));
  assert.match(team, /one current member/i);
  assert.match(team, /Jacob Yongue/);
  assert.doesNotMatch(team, /University of Georgia|Supply Chain Technologies|FastFetch Corp|Career history|Deployments/);

  const jacob = textContent(await readDist("about/team/jacob/index.html"));
  assert.match(jacob, /software engineer with an implementation background/i);
  assert.match(jacob, /Professional work remains separately attributed/);
  assert.doesNotMatch(jacob, /University of Georgia|Supply Chain Technologies|FastFetch Corp|Career history|Deployments/);

  const work = textContent(await readDist("work/index.html"));
  for (const phrase of ["Career history", "Systems delivered", "Integrations", "Deployments", "University of Georgia", "Supply Chain Technologies"]) {
    assert.ok(work.includes(phrase), `Work lost current career authority: ${phrase}`);
  }
});

test("typed Team authority contains only real current people and links to current career authority", async () => {
  assert.equal(TEAM_MEMBERS.length, 1);
  assert.deepEqual(TEAM_MEMBERS.map((member) => member.slug), ["jacob"]);
  const jacob = TEAM_MEMBERS[0];
  assert.equal(jacob.name, "Jacob Yongue");
  assert.equal(jacob.profilePath, "/about/team/jacob/");
  assert.equal(jacob.professionalPath, "/work/");

  const aboutSource = await readRoot("src/pages/About.tsx");
  assert.match(aboutSource, /TEAM_MEMBERS/);
  assert.doesNotMatch(aboutSource, /from "\.\.\/data\/professional(?:-systems)?"/, "About surfaces must not import the full professional or systems authorities");
});

test("About metadata has distinct responsibilities and canonical URLs", async () => {
  const expected = new Map([
    ["about/index.html", ["About — WizardGang", "/about/"]],
    ["about/company/index.html", ["Company — WizardGang", "/about/company/"]],
    ["about/team/index.html", ["Team — WizardGang", "/about/team/"]],
    ["about/team/jacob/index.html", ["Jacob Yongue — WizardGang Team", "/about/team/jacob/"]]
  ]);

  const descriptions = new Set();
  for (const [relative, [title, route]] of expected) {
    const html = await readDist(relative);
    assert.equal(textContent(tagBlocks(html, "title")[0].inner), title);
    const description = metaContent(html, "name", "description") || "";
    assert.ok(description.length >= 40);
    descriptions.add(description);
    assert.equal(linkByRel(html, "canonical")?.attrs.get("href"), ORIGIN + route);
    assert.equal(metaContent(html, "property", "og:url"), ORIGIN + route);
  }
  assert.equal(descriptions.size, expected.size, "About pages must not share duplicate metadata descriptions");
});

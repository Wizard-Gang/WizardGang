import type { ReactPageDefinition } from "../app/contracts";
import {
  IntegrationGroups,
  ProfessionalRoleGrid,
  ReferenceList,
  SkillList,
  SystemGroups
} from "../components/ProfessionalSurfaces";
import { professionalRoles, professionalSkills } from "../data/professional";
import { deployments, integrationGroups, systemGroups } from "../data/professional-systems";

export const WORK_METADATA = {
  title: "Work — Jacob Yongue | Professional Portfolio",
  description: "Jacob Yongue's professional portfolio: systems delivered, deployments, integrations, career history, QA, implementation, and production support from 2019 through 2026.",
  path: "/work/"
} as const;

export function SelectedWorkGrid() {
  return <ProfessionalRoleGrid roles={professionalRoles} className="selected-work-grid" />;
}

function WorkPage() {
  return (
    <main className="case-main professional-main" id="main" tabIndex={-1}>
      <section className="professional-hero">
        <div>
          <p className="kicker">Work / professional portfolio</p>
          <h1>Production work.<br /><span>Operational stakes.</span></h1>
        </div>
        <div className="professional-hero-copy">
          <p>AI, supply-chain, fulfillment, and public-sector systems delivered from discovery through production.</p>
        </div>
      </section>

      <section className="professional-experience" aria-labelledby="experience-heading">
        <div className="professional-section-heading">
          <div><p className="kicker">Career history</p><h2 id="experience-heading">Roles across the delivery path.</h2></div>
          <p>What I owned, what I delivered, and the operating context around each role.</p>
        </div>
        <ProfessionalRoleGrid roles={professionalRoles} className="experience-grid" />
      </section>

      <section className="systems-resume-section" aria-labelledby="work-systems">
        <header>
          <div><p className="kicker">Systems delivered</p><h2 id="work-systems">Real systems in real operations.</h2></div>
          <p>Systems organized by what they do.</p>
        </header>
        <div className="systems-resume-grid"><SystemGroups groups={systemGroups} /></div>
      </section>

      <section className="systems-resume-section" aria-labelledby="work-integrations">
        <header>
          <div><p className="kicker">Integrations</p><h2 id="work-integrations">Connected business operations.</h2></div>
          <p>Enterprise, warehouse, logistics, commerce, development, and automation platforms integrated into production workflows.</p>
        </header>
        <div className="systems-resume-grid"><IntegrationGroups groups={integrationGroups} /></div>
      </section>

      <section className="systems-resume-section" aria-labelledby="work-deployments">
        <header>
          <div><p className="kicker">Deployments</p><h2 id="work-deployments">Organizations and environments.</h2></div>
          <p>Organization links are provided for identification only.</p>
        </header>
        <ReferenceList items={deployments} />
      </section>

      <section className="professional-skills" aria-labelledby="skills-heading">
        <div className="professional-section-heading">
          <div><p className="kicker">Core skills</p><h2 id="skills-heading">The delivery stack.</h2></div>
          <p>The languages, platforms, and practices behind this professional record.</p>
        </div>
        <div className="skill-columns">{professionalSkills.map((group) => <SkillList key={group.label} group={group} />)}</div>
      </section>

      <p className="logo-disclaimer">Company and product marks are shown only to identify project context. All marks remain the property of their respective owners; no endorsement is implied.</p>
    </main>
  );
}

export function createWorkPageDefinitions(): readonly ReactPageDefinition[] {
  return [{
    relative: "work/index.html",
    metadata: WORK_METADATA,
    current: "work",
    body: <WorkPage />
  }];
}

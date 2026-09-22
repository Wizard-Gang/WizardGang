import type { ReactPageDefinition } from "../app/contracts";
import { WorkRow } from "../components/ProjectSurfaces";
import { PROJECTS_ROOT, projects } from "../data/projects";
import { DEMO_FRAMEWORK_URL } from "../data/site";
import { SOLUTIONS_PATH, solutionAnchor } from "../data/solutions-menu";
import {
  professionalIntegrationEvidence,
  professionalSystemEvidence
} from "../data/professional-systems";

/* Three sections, one pattern: a label, a line saying what the section is, then
   rows. Industries and integrations read at a glance, so each is one disclosure
   whose summary is built like a project row; projects stay a row each, because
   each row carries a preview worth opening on its own. */

function SectionHead({ id, label, blurb, href, hrefLabel }: {
  id: string; label: string; blurb: string; href: string; hrefLabel: string;
}) {
  return (
    <div className="section-head">
      <h2 className="section-label" id={id}>{label}</h2>
      <p className="section-blurb">{blurb}</p>
      <a className="section-more" href={href}>{hrefLabel} <span aria-hidden="true">→</span></a>
    </div>
  );
}

function SummaryRow({ number, name, detail, count }: { number: string; name: string; detail: string; count: string }) {
  return (
    <summary className="work-summary">
      <span className="work-number">{number}</span>
      <span className="work-identity">
        <span className="work-name">{name}</span>
        <span className="work-eyebrow">{count}</span>
      </span>
      <span className="work-tagline">{detail}</span>
      <span className="work-disclose" aria-hidden="true">
        <svg viewBox="0 0 16 16" focusable="false"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </summary>
  );
}

const industryCount = professionalSystemEvidence.reduce((total, group) => total + group.items.length, 0);
const integrationCount = professionalIntegrationEvidence.reduce((total, group) => total + group.items.length, 0);

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "WizardGang — Software that ships",
    description: "Software you can read, run, and keep. The industries it was delivered to, the systems it connects, and the open-source projects WizardGang builds and operates.",
    path: "/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="home-hero">
        <h1>Software that Ships</h1>
        <p className="home-lede">
          Most custom software arrives as a black box. Here you can inspect the source, read how
          each project was built, and open the live applications where available &mdash; so you can
          check the work before you pay for it, and keep what is built for you.
        </p>
      </section>

      <section className="work" aria-labelledby="home-industries-heading">
        <SectionHead
          id="home-industries-heading"
          label="Selected industries"
          blurb="Industries delivered to, and the work done in each."
          href={solutionAnchor("industries")}
          hrefLabel="All industries"
        />
        <details className="work-row" name="home-industries">
          <SummaryRow
            number="01"
            name="Industries delivered to"
            count={`${professionalSystemEvidence.length} domains`}
            detail={`${industryCount} capabilities across warehousing, logistics, courts and public-sector systems.`}
          />
          <div className="work-panel">
            <div className="evidence-groups">
              {professionalSystemEvidence.map((group) => (
                <section className="evidence-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <ul className="evidence-list" aria-label={group.title}>
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </details>
      </section>

      <section className="work" aria-labelledby="home-integrations-heading">
        <SectionHead
          id="home-integrations-heading"
          label="Selected integrations"
          blurb="Systems connected in production, and who makes them."
          href={solutionAnchor("integrations")}
          hrefLabel="All integrations"
        />
        <details className="work-row" name="home-integrations">
          <SummaryRow
            number="02"
            name="Systems connected"
            count={`${professionalIntegrationEvidence.length} groups`}
            detail={`${integrationCount} systems across ERP, commerce, warehouse automation, carriers and identity.`}
          />
          <div className="work-panel">
            <div className="evidence-groups">
              {professionalIntegrationEvidence.map((group) => (
                <section className="evidence-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <ul className="evidence-list evidence-vendors" aria-label={group.title}>
                    {group.items.map((item) => (
                      <li key={item.name}>
                        {item.url ? (
                          <a href={item.url}>
                            {item.logo
                              ? <img className="vendor-mark" src={item.logo} alt="" width={20} height={20} loading="lazy" />
                              : <span className="vendor-mark vendor-mark-text" aria-hidden="true">{item.name.slice(0, 1)}</span>}
                            {item.name} <span aria-hidden="true">↗</span>
                          </a>
                        ) : (
                          <span>
                            <span className="vendor-mark vendor-mark-text" aria-hidden="true">{item.name.slice(0, 1)}</span>
                            {item.name}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </details>
      </section>

      <section className="work" aria-labelledby="home-projects-heading">
        <SectionHead
          id="home-projects-heading"
          label="Selected projects"
          blurb="Open-source software WizardGang builds and operates."
          href={PROJECTS_ROOT}
          hrefLabel="All projects"
        />
        {projects.map((project) => <WorkRow key={project.id} project={project} />)}
      </section>

      <section className="home-outro" aria-labelledby="home-architecture-heading">
        <h2 className="section-label" id="home-architecture-heading">Go deeper</h2>
        <p className="section-blurb">
          Explore WizardGang's live architecture examples, with source and supporting evidence
          beside them.
        </p>
        <div className="outro-actions">
          <a className="outro-mail" href={DEMO_FRAMEWORK_URL}>
            Explore the Architecture <span aria-hidden="true">↗</span>
          </a>
          <a className="work-link" href={SOLUTIONS_PATH}>
            See the full record <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  )
};

import type { ReactPageDefinition } from "../app/contracts";
import { ProjectCardGrid } from "../components/ProjectSurfaces";
import { INTEGRATIONS_PATH } from "../data/integrations";
import { PROJECTS_ROOT_PATH, projects } from "../data/projects";
import { CONTACT_EMAIL } from "../data/site";

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "WizardGang — Software, Systems & Integrations",
    description: "WizardGang builds and publishes inspectable software, presents clearly attributed integration capability, and develops reusable engineering solutions.",
    path: "/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="hero">
        <div className="hero-identity">
          <p className="kicker">WizardGang</p>
          <h1>Build software.<br /><span>Make it inspectable.</span></h1>
          <div className="home-statement-card">
            <p>Software projects, integration capability, and reusable engineering frameworks in one place.</p>
          </div>
        </div>
        <div className="hero-side">
          <p>WizardGang builds and publishes practical software. Project source, case studies, and operating evidence stay close to the work, while supporting professional experience stays clearly attributed.</p>
          <div className="button-row">
            <a className="button button-primary" href="/software/">Explore software</a>
            <a className="button" href="/solutions/">View solutions</a>
          </div>
        </div>
      </section>

      <section className="portfolio-section selected-projects" aria-labelledby="home-software-heading">
        <div className="section-heading">
          <div><p className="kicker">Software</p><h2 id="home-software-heading">Working systems with source and evidence.</h2></div>
          <a className="text-link" href="/software/">Explore software <span aria-hidden="true">→</span></a>
        </div>
        <ProjectCardGrid projects={projects} />
        <a className="text-link" href={PROJECTS_ROOT_PATH}>View all projects <span aria-hidden="true">→</span></a>
      </section>

      <section className="about-teaser" aria-labelledby="home-systems-heading">
        <div>
          <p className="kicker">Systems &amp; integrations</p>
          <h2 id="home-systems-heading">Integration capability with clear attribution.</h2>
        </div>
        <div>
          <p>WizardGang works across APIs, enterprise systems, identity, data automation, and operational interfaces. The detailed capability model lives in Software; employer and customer evidence remains attributed to Jacob&apos;s professional record.</p>
          <div className="text-links"><a className="text-link" href={INTEGRATIONS_PATH}>Explore integrations <span aria-hidden="true">→</span></a><a className="text-link" href="/about/team/jacob/">See the supporting professional record <span aria-hidden="true">→</span></a></div>
        </div>
      </section>

      <section className="portfolio-section" aria-labelledby="home-solutions-heading">
        <div className="section-heading">
          <div><p className="kicker">Solutions</p><h2 id="home-solutions-heading">Reusable approaches, separate from products.</h2></div>
          <a className="text-link" href="/solutions/">Explore solutions <span aria-hidden="true">→</span></a>
        </div>
        <div className="track-grid">
          <article>
            <span>01 / Websites</span>
            <h3>Owner-controlled websites.</h3>
            <p>The current fixed-scope website offering hands over source, repository, deployment, domain, and documentation.</p>
            <a className="text-link" href="/services/">View current website offering <span aria-hidden="true">→</span></a>
          </article>
          <article>
            <span>02 / Demo framework</span>
            <h3>Architecture you can inspect.</h3>
            <p>The WizardGang Architecture Demo remains the detailed executable and evidence surface for the reusable demo framework.</p>
            <a className="text-link" href="https://demo.wizardgang.ai">Open architecture demo <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      </section>

      <section className="about-teaser" aria-labelledby="home-company-heading">
        <div>
          <p className="kicker">Company &amp; team</p>
          <h2 id="home-company-heading">Software with clear ownership.</h2>
        </div>
        <div>
          <p>WizardGang is built by Jacob Yongue, a software engineer and implementation lead. His professional background provides supporting systems and delivery context while WizardGang-owned projects remain distinct from employer work.</p>
          <div className="text-links"><a className="text-link" href="/about/company/">About WizardGang <span aria-hidden="true">→</span></a><a className="text-link" href="/about/team/">Meet the team <span aria-hidden="true">→</span></a></div>
        </div>
      </section>

      <section className="contact-band" aria-label="Explore WizardGang">
        <p>Start with the software. Go deeper when you need the evidence.</p>
        <div className="button-row">
          <a className="button button-primary" href="/software/">Explore software</a>
          <a className="button" href={`mailto:${CONTACT_EMAIL}`}>Get in touch</a>
        </div>
      </section>
    </main>
  )
};

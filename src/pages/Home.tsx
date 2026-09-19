import type { ReactPageDefinition } from "../app/contracts";
import { SelectedProjectsSection } from "./Projects";
import { SelectedWorkGrid } from "./Work";
import { CONTACT_EMAIL, HOME_CAPABILITIES } from "../data/site";

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "Jacob Yongue — Software Engineer | WizardGang",
    description: "Jacob Yongue designs, builds, integrates, and delivers software systems from requirements through production. Explore projects, professional work, and technical case studies.",
    path: "/",
    socialImage: "/og-jacob-yongue.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="hero jacob-hero">
        <div className="hero-identity">
          <h1>Jacob <span>Yongue</span></h1>
          <p className="kicker hero-role">Software engineer · Systems · Project delivery</p>
          <div className="home-statement-card"><p>I build systems that ship.</p></div>
        </div>
        <div className="hero-side">
          <p>I design, build, connect, and launch software, then help teams keep it working in production.</p>
          <div className="button-row">
            <a className="button button-primary" href="/projects/">View projects</a>
            <a className="button" href={`mailto:${CONTACT_EMAIL}`}>Get in touch</a>
          </div>
        </div>
      </section>

      <SelectedProjectsSection />

      <section className="portfolio-section selected-work" aria-labelledby="selected-work-heading">
        <div className="section-heading">
          <div><p className="kicker">Selected work</p><h2 id="selected-work-heading">Systems delivered in real operations.</h2></div>
          <a className="text-link" href="/work/">Professional portfolio <span aria-hidden="true">→</span></a>
        </div>
        <SelectedWorkGrid />
      </section>

      <section className="portfolio-section capabilities" aria-labelledby="capabilities-heading">
        <div className="section-heading"><div><p className="kicker">Capabilities</p><h2 id="capabilities-heading">From idea to production.</h2></div></div>
        <div className="capability-grid">
          {HOME_CAPABILITIES.map((item) => (
            <article key={item.number}><small>{item.number}</small><h3>{item.title}</h3><p>{item.copy}</p></article>
          ))}
        </div>
      </section>

      <section className="about-teaser" aria-labelledby="about-teaser-heading">
        <div><p className="kicker">About</p><h2 id="about-teaser-heading">Practical systems. Full ownership.</h2></div>
        <div>
          <p>I’m a software engineer and implementation lead who works comfortably across code, operations, and delivery. I learn unfamiliar domains quickly, make system boundaries explicit, and stay with the work through production.</p>
          <a className="text-link" href="/about/">About Jacob <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="contact-band" aria-label="Contact">
        <p>Need someone who can move from requirements to a working system?</p>
        <div className="button-row">
          <a className="button button-primary" href={`mailto:${CONTACT_EMAIL}`}>Get in touch</a>
          <a className="button" href="/work/">Professional work</a>
        </div>
      </section>
    </main>
  )
};

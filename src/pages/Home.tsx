import type { ReactPageDefinition } from "../app/contracts";
import { CAPABILITIES, EMPLOYERS, INDUSTRIES, INTEGRATION_GROUPS } from "../data/portfolio";
import { LINKEDIN_URL } from "../data/site";

const index = (position: number) => String(position + 1).padStart(2, "0");

function SectionHead({ number, eyebrow, id, title, blurb }: { number: string; eyebrow: string; id: string; title: string; blurb?: string }) {
  return (
    <div className="section-head">
      <p className="section-eyebrow"><span className="section-index" aria-hidden="true">{number}</span><span>{eyebrow}</span></p>
      <h2 className="section-label" id={id}>{title}</h2>
      {blurb ? <p className="section-blurb">{blurb}</p> : null}
    </div>
  );
}

function OutlineIcon({ path }: { path: string }) {
  return (
    <svg className="outline-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={path} />
    </svg>
  );
}

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "WizardGang — Software that ships",
    description: "Applications and integrations built around real operations, with live capability demos and delivery experience across warehouse, fulfillment and court systems.",
    path: "/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="home-hero" aria-labelledby="home-title">
        <p className="hero-kicker">APPLICATIONS / INTEGRATIONS</p>
        <h1 id="home-title">Software that ships.</h1>
        <p className="home-lede">
          Applications and integrations built around real operations, with source, documentation and a clear handoff.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#delivery">
            See where it's shipped <span aria-hidden="true">↘</span>
          </a>
        </div>
      </section>

      <section className="work" id="capabilities" aria-labelledby="capabilities-heading">
        <SectionHead
          number="01"
          eyebrow="What I build"
          id="capabilities-heading"
          title="Capabilities"
          blurb="Everything below runs in a live demo. Pick one and try it yourself."
        />
        <ul className="card-grid capability-grid">
          {CAPABILITIES.map(({ title, summary, icon, demos }, position) => (
            <li className="card capability-card" key={title}>
              <div className="card-title-row">
                <span className="card-icon"><OutlineIcon path={icon} /></span>
                <h3>{title}</h3>
                <span className="card-index" aria-hidden="true">{index(position)}</span>
              </div>
              <p className="card-summary">{summary}</p>
              <ul className="demo-links">
                {demos.map(({ name, detail, href }) => (
                  <li key={name}>
                    <a className="demo-link" href={href}>
                      <span className="demo-link-copy">
                        <span className="demo-link-name">{name}</span>
                        <span className="demo-link-detail">{detail}</span>
                      </span>
                      <span className="demo-link-arrow" aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="work work-tinted" id="industries" aria-labelledby="industries-heading">
        <SectionHead number="02" eyebrow="Where it applies" id="industries-heading" title="Industries" />
        <ul className="industry-grid">
          {INDUSTRIES.map(({ title, items, wide }, position) => (
            <li className={wide ? "card industry-card industry-card-wide" : "card industry-card"} key={title}>
              <div className="card-title-row">
                <h3>{title}</h3>
                <span className="card-index" aria-hidden="true">{index(position)}</span>
              </div>
              <ul className="tag-list">
                {items.map((item) => <li className="tag" key={item}>{item}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="work integrations-section" id="integrations" aria-labelledby="integrations-heading">
        <SectionHead
          number="03"
          eyebrow="Systems connected"
          id="integrations-heading"
          title="Integrations"
          blurb="Connect enterprise applications, warehouses, carriers and equipment through APIs, EDI and reliable data exchange."
        />
        <ul className="integration-list">
          {INTEGRATION_GROUPS.map(({ category, platforms }) => (
            <li className="integration-row" key={category}>
              <h3>{category}</h3>
              <ul className="platform-list">
                {platforms.map(({ name, logo }) => (
                  <li className="platform" key={name}>
                    {logo
                      ? <img className="platform-logo" src={logo} alt="" width="18" height="18" loading="lazy" />
                      : <span className="platform-mark" aria-hidden="true"></span>}
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="portfolio-attribution" role="note">
          <strong>Note</strong>
          <span>These integrations come from prior professional roles, not WizardGang client engagements.</span>
        </p>
      </section>

      <section className="work delivery-section" id="delivery" aria-labelledby="delivery-heading">
        <SectionHead number="04" eyebrow="Behind the work" id="delivery-heading" title="Delivery experience" />
        <div className="employer-list">
          {EMPLOYERS.map(({ name, scope, logo, deployments }, position) => (
            <details className="employer" key={name}>
              <summary className="employer-summary">
                <span className="employer-logo">
                  {logo
                    ? <img src={logo} alt="" width="108" height="40" loading="lazy" />
                    : <span className="platform-mark platform-mark-large" aria-hidden="true"></span>}
                </span>
                <span className="employer-copy">
                  <h3>{name}</h3>
                  <span className="employer-scope">{scope}</span>
                </span>
                <span className={position % 2 ? "employer-count employer-count-b" : "employer-count employer-count-a"}>
                  <span className="employer-count-number">{String(deployments.length).padStart(2, "0")}</span>
                  <span className="employer-count-label">deployments</span>
                </span>
                <span className="employer-chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false"><path d="M6 9l6 6 6-6" /></svg>
                </span>
              </summary>
              <ul className="deployment-list">
                {deployments.map(({ name: organization, href, solution }) => (
                  <li className="deployment" key={organization}>
                    {href
                      ? <a className="deployment-name" href={href}>{organization} <span aria-hidden="true">↗</span></a>
                      : <span className="deployment-name">{organization}</span>}
                    <span className="deployment-solution">{solution}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section className="work about-section" id="about" aria-labelledby="about-heading">
        <div className="section-head">
          <p className="section-eyebrow"><span className="section-index" aria-hidden="true">05</span><span>About</span></p>
          <h2 className="section-label" id="about-heading">Hi, I'm Jacob.</h2>
        </div>
        <p className="home-about-copy">
          WizardGang is my software shop. I've spent years building warehouse, fulfillment and court systems, and I like leaving them in good hands, with the code and the docs to keep them running.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href={LINKEDIN_URL}>
            Say hi on LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  )
};

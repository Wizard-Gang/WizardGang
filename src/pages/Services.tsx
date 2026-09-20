import type { ReactPageDefinition } from "../app/contracts";
import { INTEGRATIONS_PATH, integrationCategories } from "../data/integrations";
import { CONTACT_EMAIL } from "../data/site";
import {
  DEMO_FRAMEWORK_PATH,
  DEMO_FRAMEWORK_URL,
  SERVICES_PATH,
  WEBSITES_SOLUTION_PATH,
  WEBSITE_PACKAGES,
  demoFrameworkSolution,
  websitesSolution
} from "../data/solutions";

const anchorOf = (path: string) => path.slice(path.indexOf("#") + 1);

export const SERVICES_PAGE: ReactPageDefinition = {
  relative: "services/index.html",
  metadata: {
    title: "Services — WizardGang",
    description: "Owner-controlled websites, a reusable architecture and delivery framework, and integration work across APIs, enterprise systems, identity, and data.",
    path: SERVICES_PATH,
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <h1>Services</h1>
        <p>Three ways to work together. Each one leaves you owning the source.</p>
      </section>

      <section className="service-entry" id={anchorOf(WEBSITES_SOLUTION_PATH)} aria-labelledby="websites-heading">
        <p className="work-index"><span className="work-number">01</span><span>Websites</span></p>
        <h2 id="websites-heading">{websitesSolution.name}</h2>
        <p className="work-entry-lede">{websitesSolution.summary}</p>
        <ul className="service-packages">
          {WEBSITE_PACKAGES.map((pack) => (
            <li key={pack.name}>
              <strong>{pack.name}</strong>
              <em>{pack.price} · {pack.pages}</em>
              <span>{pack.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="service-entry" id={anchorOf(DEMO_FRAMEWORK_PATH)} aria-labelledby="demo-framework-heading">
        <p className="work-index"><span className="work-number">02</span><span>Demo Framework</span></p>
        <h2 id="demo-framework-heading">{demoFrameworkSolution.name}</h2>
        <p className="work-entry-lede">{demoFrameworkSolution.summary}</p>
        <a className="work-link" href={DEMO_FRAMEWORK_URL}>
          See it running <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section className="service-entry" id={anchorOf(INTEGRATIONS_PATH)} aria-labelledby="integrations-heading">
        <p className="work-index"><span className="work-number">03</span><span>Integrations</span></p>
        <h2 id="integrations-heading">Integration work</h2>
        <p className="work-entry-lede">
          Connecting systems across five durable boundaries rather than a list of vendor names.
        </p>
        <ul className="service-packages">
          {integrationCategories.map((category) => (
            <li key={category.id}><strong>{category.name}</strong><span>{category.summary}</span></li>
          ))}
        </ul>
      </section>

      <section className="home-outro" aria-labelledby="services-contact-heading">
        <h2 className="section-label" id="services-contact-heading">Start a conversation</h2>
        <a className="outro-mail" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL} <span aria-hidden="true">→</span>
        </a>
      </section>
    </main>
  )
};

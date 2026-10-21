import type { ReactPageDefinition } from "../app/contracts";
import { GITHUB_ORG_URL } from "../data/site";

const services = [
  { title: "System integration", description: "Connect enterprise applications, warehouses, carriers and equipment through APIs, EDI and reliable data exchange." },
  { title: "Warehouse automation", description: "Bring WMS, warehouse control systems, labels and conveyor decisions into one working flow." },
  { title: "Data & reporting", description: "Turn operational SQL data into reconciliation, audit trails and reports that help people act." },
  { title: "Regulated applications", description: "Build, migrate and support software with testing, traceability and access controls in mind." }
] as const;

interface Integration {
  category: string;
  title: string;
  attribution: string;
  description: string;
  technologies: string;
  platforms: readonly { label: string; href: string }[];
}

const integrations: readonly Integration[] = [
  {
    category: "SHIPPING / CONTROLS",
    title: "Shipping compliance & dock routing",
    attribution: "Professional warehouse integration work",
    description: "Built a Shipium integration that evaluated package contents, lot and expiry dates, ship-by limits, destination rules and eligible shipping methods. It selected ground, air or sea transport, generated labels and directed print-and-apply equipment and conveyor PLCs through the warehouse management and control systems.",
    technologies: "WMS · WCS · SQL Server · PLCs · Shipping rules",
    platforms: [{ label: "Shipium", href: "https://docs.shipium.com/docs/apis-introduction" }]
  },
  {
    category: "ERP / WAREHOUSE",
    title: "Enterprise ERP and WMS cutovers",
    attribution: "Supply Chain Technologies",
    description: "Connected order, inventory and financial records across NetSuite, Sage and warehouse systems. Planned the integration and cutover so daily warehouse work could continue while the systems changed.",
    technologies: "ERP · WMS · REST APIs · EDI · Data migration",
    platforms: [
      { label: "NetSuite", href: "https://www.netsuite.com/" },
      { label: "Sage", href: "https://www.sage.com/en-us/erp/" }
    ]
  },
  {
    category: "FULFILLMENT / CARRIERS",
    title: "Carrier and fulfillment integrations",
    attribution: "Fastfetch",
    description: "Built fulfillment and warehouse-connected services that exchanged shipment and tracking data with carrier systems. Supported warehouse migrations, high-volume data flows and operational continuity across North American sites.",
    technologies: "C#/.NET · REST APIs · ETL · Fulfillment",
    platforms: [
      { label: "UPS", href: "https://www.ups.com/" },
      { label: "USPS", href: "https://www.usps.com/" },
      { label: "FedEx", href: "https://www.fedex.com/" }
    ]
  },
  {
    category: "DATA / RECONCILIATION",
    title: "Inventory and financial reconciliation",
    attribution: "Supply Chain Technologies",
    description: "Built SQL and audit-reporting workflows to compare inventory movements and financial records across connected enterprise systems. The work helped resolve more than $10 million in recorded variances without interrupting operations.",
    technologies: "SQL Server · ETL · Audit reporting · Reconciliation",
    platforms: []
  },
  {
    category: "PUBLIC SECTOR / CJIS",
    title: "Regulated case management and reporting",
    attribution: "Spartan Technology Solutions",
    description: "Implemented case-management workflows, historical data migrations and SQL reporting for a state attorney environment. Supported testing and production readiness under CJIS requirements.",
    technologies: "C#/.NET · SQL Server · SSRS · Migration · QA/UAT",
    platforms: []
  }
];

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "WizardGang — Integration engineering portfolio",
    description: "A portfolio of enterprise integrations, warehouse automation, compliant shipping, ERP cutovers, data reconciliation and regulated software work from prior professional roles.",
    path: "/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="home-hero" aria-labelledby="home-title">
        <p className="hero-kicker">INTEGRATION ENGINEERING / SELECTED WORK</p>
        <h1 id="home-title">Making complex systems work together.</h1>
        <p className="home-lede">
          A portfolio of enterprise integration, warehouse automation, software delivery
          and the operational problems behind them.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#integrations">
            Explore integrations <span aria-hidden="true">↘</span>
          </a>
          <a className="button" href={GITHUB_ORG_URL}>
            View GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="work" id="services" aria-labelledby="services-heading">
        <div className="section-head">
          <p className="section-eyebrow">CAPABILITIES</p>
          <h2 className="section-label" id="services-heading">Services</h2>
          <p className="section-blurb">Engineering focused on the systems behind everyday operations.</p>
        </div>
        <ul className="home-topic-grid home-topic-grid-services">
          {services.map(({ title, description }, index) => (
            <li className="home-topic" key={title}>
              <span className="topic-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="work integrations-section" id="integrations" aria-labelledby="integrations-heading">
        <div className="section-head">
          <p className="section-eyebrow">SELECTED IMPLEMENTATIONS</p>
          <h2 className="section-label" id="integrations-heading">Integrations</h2>
          <p className="section-blurb">Systems I've connected, shipped and supported in real operations.</p>
        </div>
        <ol className="integration-grid">
          {integrations.map((item, index) => (
            <li className="integration-case" key={item.title}>
              <article>
                <div className="case-topline">
                  <span className="case-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="case-category">{item.category}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="case-attribution">{item.attribution}</p>
                <p className="case-description">{item.description}</p>
                <p className="case-tech">{item.technologies}</p>
                {item.platforms.length > 0 && (
                  <ul className="case-platforms" aria-label="Platforms">
                    {item.platforms.map((platform) => (
                      <li key={platform.label}>
                        <a href={platform.href}>{platform.label} <span aria-hidden="true">↗</span></a>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
        </ol>
        <p className="portfolio-attribution" role="note">
          These implementations come from prior professional roles, not WizardGang client engagements.
        </p>
      </section>

      <section className="work about-section" id="about" aria-labelledby="about-heading">
        <div className="section-head">
          <p className="section-eyebrow">BEHIND THE WORK</p>
          <h2 className="section-label" id="about-heading">About</h2>
        </div>
        <p className="home-about-copy">
          I'm an implementation consultant, software engineer and qualified project manager.
          My work connects operational needs to working systems, from discovery and integration
          through testing, cutover and support.
        </p>
        <a className="about-link" href={GITHUB_ORG_URL}>
          Explore the code on GitHub <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  )
};

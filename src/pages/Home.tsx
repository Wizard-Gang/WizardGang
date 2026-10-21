import type { ReactPageDefinition } from "../app/contracts";
import { GITHUB_ORG_URL } from "../data/site";

const services = [
  { title: "System integration", description: "Connect enterprise applications, warehouses, carriers and equipment through APIs, EDI and reliable data exchange." },
  { title: "Warehouse automation", description: "Bring WMS, warehouse control systems, labels and conveyor decisions into one working flow." },
  { title: "Data & reporting", description: "Turn operational SQL data into reconciliation, audit trails and reports that help people act." },
  { title: "Regulated applications", description: "Build, migrate and support software with testing, traceability and access controls in mind." }
] as const;

// Historically documented professional integrations from the retired
// /solutions/ route, src/data/professional-systems.ts at
// e7944ff21609d24d09e08df110bdd6aa3ac0383d.
// Platform inventory only: no invented case studies or vendor endorsements.
const integrationGroups = [
  { category: "ERP & WMS", platforms: ["NetSuite","Microsoft Dynamics","Sage","Fishbowl","QuickBooks POS","RedPrairie","Blue Yonder","CIMS WMS","Canbar"] },
  { category: "Commerce & fulfillment", platforms: ["Shopify","Amazon Direct Fulfillment","ShipStation","Shipium","ProShip"] },
  { category: "Warehouse automation", platforms: ["A360","Locus","6 River Systems","AutoStore","Corvus","Pendant"] },
  { category: "Carriers", platforms: ["USPS","UPS","FedEx"] },
  { category: "EDI & B2B", platforms: ["EDI Orders","Acknowledgements","ASNs","Invoices","Inventory & Fulfillment Flows"] },
  { category: "Warehouse hardware", platforms: ["Zebra","Honeywell"] },
  { category: "Development & workflow", platforms: ["GitHub","Jira","Zapier"] },
  { category: "Justice & legal", platforms: ["Axon","LexisNexis"] }
] as const;

export const HOME_PAGE: ReactPageDefinition = {
  relative: "index.html",
  metadata: {
    title: "WizardGang — Integration engineering portfolio",
    description: "Historical ERP, shipping, warehouse automation, carrier, EDI and legal integrations from earlier professional roles.",
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
          <p className="section-blurb">Selected platforms and systems from prior professional work.</p>
        </div>
        <ul className="integration-list">
          {integrationGroups.map(({ category, platforms }) => (
            <li className="integration-row" key={category}>
              <h3>{category}</h3>
              <p>{platforms.join(" · ")}</p>
            </li>
          ))}
        </ul>
        <p className="portfolio-attribution" role="note">
          These integrations come from prior professional roles, not WizardGang client engagements.
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

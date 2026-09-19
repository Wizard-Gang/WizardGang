import type { ReactPageDefinition } from "../app/contracts";
import { CONTACT_EMAIL } from "../data/site";
import { WEBSITE_PACKAGES } from "../data/services";

export const SERVICES_PAGE: ReactPageDefinition = {
  relative: "services/index.html",
  metadata: {
    title: "Website Services — Jacob Yongue | WizardGang",
    description: "Fixed-scope small-business websites with owner-controlled source code, GitHub repository, Cloudflare deployment, domain, and documented handoff.",
    path: "/services/"
  },
  body: (
    <main className="case-main services-main" id="main" tabIndex={-1}>
      <section className="services-hero">
        <div><p className="kicker">Services / small-business websites</p><h1><span className="services-hero-line-primary">Launch the site.</span><span>Keep the keys.</span></h1></div>
        <div className="services-hero-copy">
          <p>I don’t sell you a website subscription. I build you a small piece of software and hand you the keys.</p>
          <div className="button-row"><a className="button button-primary" href={`mailto:${CONTACT_EMAIL}?subject=Website%20package%20inquiry`}>Start a project</a></div>
        </div>
      </section>

      <section className="service-packages" aria-labelledby="packages-heading">
        <header>
          <div><p className="kicker">Website packages</p><h2 id="packages-heading">Choose the scope that fits.</h2></div>
          <p>Each package uses the same responsive, config-driven foundation. The difference is how many routes and customer-facing features the site includes.</p>
        </header>
        <div className="service-package-grid">
          {WEBSITE_PACKAGES.map((item, index) => (
            <article className={`service-package${index === 2 ? " service-package-featured" : ""}`} key={item.name}>
              <header><span>{String(index + 1).padStart(2, "0")} / {item.name}</span><strong>{item.price}</strong></header>
              <h3>{item.pages}</h3>
              <p>{item.description}</p>
              <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="service-ownership" aria-labelledby="ownership-heading">
        <header>
          <div><p className="kicker">Ownership</p><h2 id="ownership-heading">The website is yours.</h2></div>
          <p>Most website builders keep the system behind your site. This approach gives you a real software project that you can see, own, and move.</p>
        </header>
        <p className="service-statement">Your website. Your code. Your infrastructure.</p>
        <div className="service-stack" role="list" aria-label="Website ownership and deployment path">
          <article role="listitem"><span>01</span><h3>GitHub</h3><p>Your source code, site configuration, content, and change history live in a repository you control.</p></article>
          <article role="listitem"><span>02</span><h3>Cloudflare</h3><p>Cloudflare builds and delivers the site, handles HTTPS, and connects it to the internet from infrastructure you control.</p></article>
          <article role="listitem"><span>03</span><h3>Your domain</h3><p>Your business address points directly to your deployment. I do not have to stay in the middle.</p></article>
        </div>
        <aside className="service-cost">
          <div><p className="kicker">A small system first</p><h3>No required monthly hosting subscription for qualifying sites.</h3></div>
          <div>
            <p>For qualifying small-business sites, production infrastructure can run on the free tiers of GitHub and Cloudflare. Cloudflare currently includes 100,000 Worker requests per day on its free plan, and static asset requests are free and unlimited.</p>
            <p>Domain registration, paid add-ons, and usage above current free-tier limits are separate. The point is ownership—not a promise that every site will cost $0 forever.</p>
            <div className="text-links">
              <a className="text-link" href="https://developers.cloudflare.com/workers/platform/pricing/">Cloudflare limits <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="https://docs.github.com/en/get-started/learning-about-github/githubs-plans">GitHub plans <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </aside>
      </section>

      <section className="service-handoff" aria-labelledby="handoff-heading">
        <div>
          <p className="kicker">Handoff</p>
          <h2 id="handoff-heading">Built to be handed over.</h2>
          <p>I can build, configure, test, and launch the site. You receive the pieces another developer—or an AI coding tool—would need to continue the work later.</p>
        </div>
        <ul>
          <li>Source code</li><li>GitHub repository</li><li>Site configuration and content</li><li>Domain and deployment configuration</li><li>Change and deployment history</li><li>Documentation for future work</li>
        </ul>
      </section>

      <section className="service-process" aria-labelledby="process-heading">
        <header>
          <div><p className="kicker">Delivery</p><h2 id="process-heading">From business details to a working site.</h2></div>
          <p>You provide the business information, brand direction, approved copy, images, and domain access. I configure, test, deploy, and hand over the working site.</p>
        </header>
        <div className="service-process-grid">
          <article><span>01</span><h3>Define the site</h3><p>Confirm the package, pages, content, visual direction, and contact path.</p></article>
          <article><span>02</span><h3>Build and check</h3><p>Configure the site, test its routes and forms, and prepare the production domain.</p></article>
          <article><span>03</span><h3>Deploy and hand over</h3><p>Publish the site and leave the source, configuration, and deployment under your control.</p></article>
        </div>
      </section>

      <section className="service-growth" aria-labelledby="growth-heading">
        <div><p className="kicker">Start small, grow for a reason</p><h2 id="growth-heading">Add infrastructure when the business needs it.</h2></div>
        <ol>
          <li><span>01</span><strong>Buy</strong><small>A fixed-scope site</small></li>
          <li><span>02</span><strong>Own</strong><small>Code, domain, deployment</small></li>
          <li><span>03</span><strong>Understand</strong><small>A visible source of truth</small></li>
          <li><span>04</span><strong>Verify</strong><small>History and checks</small></li>
          <li><span>05</span><strong>Grow</strong><small>Forms, data, booking, or automation</small></li>
        </ol>
      </section>

      <section className="service-notes">
        <div><p className="kicker">Scope</p><h2>Clear package boundaries.</h2></div>
        <p>Domain purchases, paid third-party services, custom application features, ecommerce, and large copy or content migrations are quoted separately before work begins.</p>
      </section>

      <section className="contact-band" aria-label="Website service contact">
        <p>Ready to own the website you pay for?</p>
        <div className="button-row"><a className="button button-primary" href={`mailto:${CONTACT_EMAIL}?subject=Website%20package%20inquiry`}>Get in touch</a></div>
      </section>
    </main>
  )
};

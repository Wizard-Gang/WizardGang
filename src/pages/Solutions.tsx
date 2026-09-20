import type { ReactPageDefinition } from "../app/contracts";
import {
  DEMO_FRAMEWORK_AREAS,
  DEMO_FRAMEWORK_PATH,
  DEMO_FRAMEWORK_PROCESS,
  DEMO_FRAMEWORK_URL,
  SOLUTIONS_ROOT_PATH,
  WEBSITES_SOLUTION_PATH,
  WEBSITE_PACKAGES,
  demoFrameworkSolution,
  solutions,
  websitesSolution
} from "../data/solutions";
import { CONTACT_EMAIL } from "../data/site";

export const SOLUTIONS_PAGE: ReactPageDefinition = {
  relative: "solutions/index.html",
  metadata: {
    title: "Solutions — WizardGang",
    description: "Reusable WizardGang delivery approaches and frameworks, distinct from the software products and integration capability under Software.",
    path: SOLUTIONS_ROOT_PATH,
    socialImage: "/og.jpg"
  },
  body: (
    <main className="case-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <p className="kicker">Solutions</p>
        <h1>Reusable approaches<br /><span>for software delivery.</span></h1>
        <p>Software is what WizardGang builds. Solutions are repeatable delivery approaches and frameworks WizardGang applies to a problem.</p>
      </section>
      <section className="solution-card-grid" aria-label="WizardGang solutions">
        {solutions.map((solution, index) => (
          <article className="solution-card" key={solution.id}>
            <span>{String(index + 1).padStart(2, "0")} / {solution.name}</span>
            <h2>{solution.name === "Websites" ? "Owner-controlled websites." : "Architecture you can inspect."}</h2>
            <p>{solution.summary}</p>
            <a className="text-link" href={solution.path}>Explore {solution.name} <span aria-hidden="true">→</span></a>
          </article>
        ))}
      </section>
      <section className="case-section">
        <div className="case-label">Boundary</div>
        <div>
          <h2>Solutions do not replace Software.</h2>
          <p>Projects and integration capability remain canonical under Software. Solutions explain reusable ways WizardGang delivers, demonstrates, and hands over software without duplicating those catalogs.</p>
          <a className="text-link" href="/software/">Explore software <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
  )
};

export const WEBSITES_SOLUTION_PAGE: ReactPageDefinition = {
  relative: "solutions/websites/index.html",
  metadata: {
    title: "Websites — WizardGang Solutions",
    description: "Fixed-scope small-business websites with owner-controlled source code, GitHub repository, Cloudflare deployment, domain, and documented handoff.",
    path: WEBSITES_SOLUTION_PATH
  },
  body: (
    <main className="case-main services-main" id="main" tabIndex={-1}>
      <a className="crumb" href={SOLUTIONS_ROOT_PATH}>← Solutions</a>
      <section className="services-hero">
        <div><p className="kicker">Solutions / Websites</p><h1><span className="services-hero-line-primary">Launch the site.</span><span>Keep the keys.</span></h1></div>
        <div className="services-hero-copy">
          <p>{websitesSolution.description}</p>
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
          <article role="listitem"><span>03</span><h3>Your domain</h3><p>Your business address points directly to your deployment. WizardGang does not have to stay in the middle.</p></article>
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
          <p>WizardGang can build, configure, test, and launch the site. The owner receives the pieces another developer—or an AI coding tool—would need to continue the work later.</p>
        </div>
        <ul>
          <li>Source code</li><li>GitHub repository</li><li>Site configuration and content</li><li>Domain and deployment configuration</li><li>Change and deployment history</li><li>Documentation for future work</li>
        </ul>
      </section>

      <section className="service-process" aria-labelledby="website-delivery-heading">
        <header>
          <div><p className="kicker">Delivery</p><h2 id="website-delivery-heading">From business details to a working site.</h2></div>
          <p>The owner provides business information, brand direction, approved copy, images, and domain access. WizardGang configures, tests, deploys, and hands over the working site.</p>
        </header>
        <div className="service-process-grid">
          <article><span>01</span><h3>Define the site</h3><p>Confirm the package, pages, content, visual direction, and contact path.</p></article>
          <article><span>02</span><h3>Build and check</h3><p>Configure the site, test its routes and forms, and prepare the production domain.</p></article>
          <article><span>03</span><h3>Deploy and hand over</h3><p>Publish the site and leave the source, configuration, and deployment under the owner&apos;s control.</p></article>
        </div>
      </section>

      <section className="service-growth" aria-labelledby="website-growth-heading">
        <div><p className="kicker">Start small, grow for a reason</p><h2 id="website-growth-heading">Add infrastructure when the business needs it.</h2></div>
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

      <section className="contact-band" aria-label="Website solution contact">
        <p>Ready to own the website you pay for?</p>
        <div className="button-row"><a className="button button-primary" href={`mailto:${CONTACT_EMAIL}?subject=Website%20package%20inquiry`}>Get in touch</a></div>
      </section>
    </main>
  )
};

export const DEMO_FRAMEWORK_PAGE: ReactPageDefinition = {
  relative: "solutions/demo-framework/index.html",
  metadata: {
    title: "Demo Framework — WizardGang Solutions",
    description: "WizardGang's reusable architecture and delivery framework for inspectable requirements, controlled changes, validation, releases, deployment, assurance, and operations.",
    path: DEMO_FRAMEWORK_PATH
  },
  body: (
    <main className="case-main" id="main" tabIndex={-1}>
      <a className="crumb" href={SOLUTIONS_ROOT_PATH}>← Solutions</a>
      <section className="page-hero">
        <p className="kicker">Solutions / Demo Framework</p>
        <h1>Make architecture<br /><span>inspectable.</span></h1>
        <p>{demoFrameworkSolution.description}</p>
        <div className="button-row">
          <a className="button button-primary" href={DEMO_FRAMEWORK_URL} aria-label="Explore the WizardGang Architecture Demo at demo.wizardgang.ai">Explore the architecture demo <span aria-hidden="true">↗</span></a>
          <a className="button" href="/software/">Explore WizardGang software <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="case-section" aria-labelledby="demo-process-heading">
        <div className="case-label">Process model</div>
        <div>
          <h2 id="demo-process-heading">Trace the work from requirement to operation.</h2>
          <p>The architecture standard uses a durable evidence chain: Requirement → Change → Validation → Release → Deployment → Operation.</p>
          <ol className="solution-process-list">
            {DEMO_FRAMEWORK_PROCESS.map((step, index) => (
              <li key={step.id} data-process-step={step.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.name}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="case-section" aria-labelledby="demo-areas-heading">
        <div className="case-label">Inspectable proof</div>
        <div>
          <h2 id="demo-areas-heading">The detailed demo stays on the demo application.</h2>
          <p>The company site explains the framework. The architecture demo owns the interactive implementation, route-specific demonstrations, assurance records, security boundary, and operational machine contracts.</p>
          <div className="solution-area-grid">
            {DEMO_FRAMEWORK_AREAS.map((area) => (
              <article key={area.id}>
                <h3>{area.name}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">Controlled change</div>
        <div>
          <h2>Make changes small enough to trace and verify.</h2>
          <p>Controlled changes carry a permanent identity, a clear purpose, and validation appropriate to their risk. Pull requests, automated checks, review, releases, deployment evidence, and runtime records preserve the path without turning the public company site into an internal change log.</p>
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">Architecture &amp; assurance</div>
        <div>
          <h2>Keep boundaries and claims visible.</h2>
          <p>The demo documents architecture and exposes executable examples for APIs, data, integrations, identity, AI/MCP, accessibility, and internationalization. Its assurance workbench includes ISO/IEC 27001, ISO/IEC 42001, and WCAG 2.2 assessment records. Those references are aligned or assessed evidence, not certification claims.</p>
        </div>
      </section>

      <section className="case-section">
        <div className="case-label">Operations</div>
        <div>
          <h2>Delivery continues after implementation.</h2>
          <p>The demo keeps compact public proof for service/dependency state, measured availability, and running release/source identity. Deeper logs, reporting, administration, and operational APIs remain separate machine or protected contracts rather than a duplicated public dashboard.</p>
          <a className="text-link" href={DEMO_FRAMEWORK_URL} aria-label="Open the WizardGang Architecture Demo at demo.wizardgang.ai">Open the detailed demo <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="project-depth">
        <div><p className="kicker">Public boundary</p><h2>Orientation here. Demonstration there.</h2></div>
        <div>
          <p>WizardGang.ai owns the company-facing explanation. demo.wizardgang.ai owns the detailed executable proof and evidence. That keeps one authority for each level instead of maintaining two copies of the same architecture.</p>
          <div className="text-links">
            <a className="text-link" href="/about/company/">About WizardGang <span aria-hidden="true">→</span></a>
            <a className="text-link" href={DEMO_FRAMEWORK_URL} aria-label="Explore demo.wizardgang.ai">Explore demo.wizardgang.ai <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </main>
  )
};

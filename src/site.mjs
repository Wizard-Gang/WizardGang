
const CONTACT_EMAIL = "jacob@wizardgang.ai";
const WEBSITE_PACKAGES = [
  {
    name: "Starter",
    price: "$95",
    pages: "Up to 3 pages",
    description: "A focused site for a small business that needs a credible home, clear services, and a direct contact path.",
    features: ["Responsive design", "Home, services, and contact routes", "Direct email and contact details", "Owner-controlled source and deployment"]
  },
  {
    name: "Business",
    price: "$195",
    pages: "Up to 5 pages",
    description: "A broader business site with room to show the work, establish trust, and collect useful customer inquiries.",
    features: ["Everything in Starter", "Gallery and testimonial sections", "Service-area content", "First-party contact form"]
  },
  {
    name: "Owner+",
    price: "$350",
    pages: "Up to 8 pages",
    description: "A complete site with dedicated pages, stored contact requests, and documentation for future maintenance.",
    features: ["Everything in Business", "FAQ and expanded content routes", "Stored contact submissions", "AI-ready documentation and automated deployment"]
  }
];

const escapeHtml = (value) => String(value).replace(/[&<>\"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;"
})[character]);

function page({ title, description, path, current = "", body, social = false, noindex = false }) {
  return {
    metadata: {
      title,
      description,
      path,
      noIndex: noindex,
      socialImage: social ? "/og-jacob-yongue.jpg" : undefined
    },
    current,
    body
  };
}


function capabilityGrid() {
  const items = [
    ["01", "Build the software", "I turn requirements into applications, APIs, data tools, and automation."],
    ["02", "Connect the systems", "I make business systems share the right data at the right time."],
    ["03", "Put it into use", "I move data, configure workflows, test, train users, and support launch."],
    ["04", "Lead the work", "I keep scope, owners, risks, and releases clear."],
    ["05", "Keep it running", "I monitor production, respond to incidents, improve recovery, and document changes."]
  ];
  return `<div class="capability-grid">${items.map(([number, title, copy]) => `<article><small>${number}</small><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div>`;
}

function home() {
  const body = `<main class="site-main" id="main" tabindex="-1">
    <section class="hero jacob-hero"><div class="hero-identity"><h1>Jacob <span>Yongue</span></h1><p class="kicker hero-role">Software engineer · Systems · Project delivery</p><div class="home-statement-card"><p>I build systems that ship.</p></div></div><div class="hero-side"><p>I design, build, connect, and launch software, then help teams keep it working in production.</p><div class="button-row"><a class="button button-primary" href="/projects/">View projects</a><a class="button" href="mailto:${CONTACT_EMAIL}">Get in touch</a></div></div></section>
    <template data-wizardgang-selected-projects=""></template>
    <section class="portfolio-section selected-work" aria-labelledby="selected-work-heading"><div class="section-heading"><div><p class="kicker">Selected work</p><h2 id="selected-work-heading">Systems delivered in real operations.</h2></div><a class="text-link" href="/work/">Professional portfolio <span aria-hidden="true">→</span></a></div><template data-wizardgang-selected-work=""></template></section>
    <section class="portfolio-section capabilities" aria-labelledby="capabilities-heading"><div class="section-heading"><div><p class="kicker">Capabilities</p><h2 id="capabilities-heading">From idea to production.</h2></div></div>${capabilityGrid()}</section>
    <section class="about-teaser" aria-labelledby="about-teaser-heading"><div><p class="kicker">About</p><h2 id="about-teaser-heading">Practical systems. Full ownership.</h2></div><div><p>I’m a software engineer and implementation lead who works comfortably across code, operations, and delivery. I learn unfamiliar domains quickly, make system boundaries explicit, and stay with the work through production.</p><a class="text-link" href="/about/">About Jacob <span aria-hidden="true">→</span></a></div></section>
    <section class="contact-band" aria-label="Contact"><p>Need someone who can move from requirements to a working system?</p><div class="button-row"><a class="button button-primary" href="mailto:${CONTACT_EMAIL}">Get in touch</a><a class="button" href="/work/">Professional work</a></div></section>
  </main>`;
  return page({ title: "Jacob Yongue — Software Engineer | WizardGang", description: "Jacob Yongue designs, builds, integrates, and delivers software systems from requirements through production. Explore projects, professional work, and technical case studies.", path: "/", body, social: true });
}

function services() {
  const packageCards = WEBSITE_PACKAGES.map((item, index) => `<article class="service-package${index === 2 ? " service-package-featured" : ""}"><header><span>${String(index + 1).padStart(2, "0")} / ${escapeHtml(item.name)}</span><strong>${escapeHtml(item.price)}</strong></header><h3>${escapeHtml(item.pages)}</h3><p>${escapeHtml(item.description)}</p><ul>${item.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul></article>`).join("");
  const body = `<main class="case-main services-main" id="main" tabindex="-1">
    <section class="services-hero"><div><p class="kicker">Services / small-business websites</p><h1><span class="services-hero-line-primary">Launch the site.</span><span>Keep the keys.</span></h1></div><div class="services-hero-copy"><p>I don’t sell you a website subscription. I build you a small piece of software and hand you the keys.</p><div class="button-row"><a class="button button-primary" href="mailto:${CONTACT_EMAIL}?subject=Website%20package%20inquiry">Start a project</a></div></div></section>
    <section class="service-packages" aria-labelledby="packages-heading"><header><div><p class="kicker">Website packages</p><h2 id="packages-heading">Choose the scope that fits.</h2></div><p>Each package uses the same responsive, config-driven foundation. The difference is how many routes and customer-facing features the site includes.</p></header><div class="service-package-grid">${packageCards}</div></section>
    <section class="service-ownership" aria-labelledby="ownership-heading"><header><div><p class="kicker">Ownership</p><h2 id="ownership-heading">The website is yours.</h2></div><p>Most website builders keep the system behind your site. This approach gives you a real software project that you can see, own, and move.</p></header><p class="service-statement">Your website. Your code. Your infrastructure.</p><div class="service-stack" role="list" aria-label="Website ownership and deployment path"><article role="listitem"><span>01</span><h3>GitHub</h3><p>Your source code, site configuration, content, and change history live in a repository you control.</p></article><article role="listitem"><span>02</span><h3>Cloudflare</h3><p>Cloudflare builds and delivers the site, handles HTTPS, and connects it to the internet from infrastructure you control.</p></article><article role="listitem"><span>03</span><h3>Your domain</h3><p>Your business address points directly to your deployment. I do not have to stay in the middle.</p></article></div><aside class="service-cost"><div><p class="kicker">A small system first</p><h3>No required monthly hosting subscription for qualifying sites.</h3></div><div><p>For qualifying small-business sites, production infrastructure can run on the free tiers of GitHub and Cloudflare. Cloudflare currently includes 100,000 Worker requests per day on its free plan, and static asset requests are free and unlimited.</p><p>Domain registration, paid add-ons, and usage above current free-tier limits are separate. The point is ownership—not a promise that every site will cost $0 forever.</p><div class="text-links"><a class="text-link" href="https://developers.cloudflare.com/workers/platform/pricing/">Cloudflare limits <span aria-hidden="true">↗</span></a><a class="text-link" href="https://docs.github.com/en/get-started/learning-about-github/githubs-plans">GitHub plans <span aria-hidden="true">↗</span></a></div></div></aside></section>
    <section class="service-handoff" aria-labelledby="handoff-heading"><div><p class="kicker">Handoff</p><h2 id="handoff-heading">Built to be handed over.</h2><p>I can build, configure, test, and launch the site. You receive the pieces another developer—or an AI coding tool—would need to continue the work later.</p></div><ul><li>Source code</li><li>GitHub repository</li><li>Site configuration and content</li><li>Domain and deployment configuration</li><li>Change and deployment history</li><li>Documentation for future work</li></ul></section>
    <section class="service-process" aria-labelledby="process-heading"><header><div><p class="kicker">Delivery</p><h2 id="process-heading">From business details to a working site.</h2></div><p>You provide the business information, brand direction, approved copy, images, and domain access. I configure, test, deploy, and hand over the working site.</p></header><div class="service-process-grid"><article><span>01</span><h3>Define the site</h3><p>Confirm the package, pages, content, visual direction, and contact path.</p></article><article><span>02</span><h3>Build and check</h3><p>Configure the site, test its routes and forms, and prepare the production domain.</p></article><article><span>03</span><h3>Deploy and hand over</h3><p>Publish the site and leave the source, configuration, and deployment under your control.</p></article></div></section>
    <section class="service-growth" aria-labelledby="growth-heading"><div><p class="kicker">Start small, grow for a reason</p><h2 id="growth-heading">Add infrastructure when the business needs it.</h2></div><ol><li><span>01</span><strong>Buy</strong><small>A fixed-scope site</small></li><li><span>02</span><strong>Own</strong><small>Code, domain, deployment</small></li><li><span>03</span><strong>Understand</strong><small>A visible source of truth</small></li><li><span>04</span><strong>Verify</strong><small>History and checks</small></li><li><span>05</span><strong>Grow</strong><small>Forms, data, booking, or automation</small></li></ol></section>
    <section class="service-notes"><div><p class="kicker">Scope</p><h2>Clear package boundaries.</h2></div><p>Domain purchases, paid third-party services, custom application features, ecommerce, and large copy or content migrations are quoted separately before work begins.</p></section>
    <section class="contact-band" aria-label="Website service contact"><p>Ready to own the website you pay for?</p><div class="button-row"><a class="button button-primary" href="mailto:${CONTACT_EMAIL}?subject=Website%20package%20inquiry">Get in touch</a></div></section>
  </main>`;
  return page({ title: "Website Services — Jacob Yongue | WizardGang", description: "Fixed-scope small-business websites with owner-controlled source code, GitHub repository, Cloudflare deployment, domain, and documented handoff.", path: "/services/", current: "services", body});
}

function about() {
  const body = `<main class="case-main about-main" id="main" tabindex="-1"><section class="page-hero about-hero"><p class="kicker">About Jacob Yongue</p><h1>Build the whole path.<br><span>Own the outcome.</span></h1><div class="prose"><p>I’m a software engineer with an implementation background and a systems view of delivery. My work spans requirements, architecture, application development, integrations, QA, deployment, training, operational handoff, and production support.</p><p>I’m most useful when the problem crosses boundaries: code and workflow, product and operations, technical design and project delivery. I make those boundaries explicit, learn the unfamiliar parts quickly, and keep evidence close enough that another person can understand what the system actually does.</p></div></section>
    <section class="about-principles" aria-labelledby="approach-heading"><div><p class="kicker">Approach</p><h2 id="approach-heading">Practical systems over isolated artifacts.</h2></div><div class="principle-grid"><article><span>01</span><h3>Systems thinking</h3><p>Model the workflow, failure modes, ownership, and operating environment before optimizing an isolated component.</p></article><article><span>02</span><h3>Implementation depth</h3><p>Stay hands-on through the code, integration, testing, deployment, adoption, and the edge cases production reveals.</p></article><article><span>03</span><h3>Project ownership</h3><p>Make scope, risk, decisions, and handoff legible so progress survives team and technology boundaries.</p></article><article><span>04</span><h3>Learning velocity</h3><p>Reduce unfamiliar technology to explicit contracts, inspectable behavior, and small verifiable steps.</p></article></div></section>
  </main>`;
  return page({ title: "About Jacob Yongue — Software Engineer", description: "About Jacob Yongue: software engineer, implementation lead, systems thinker, and project owner focused on practical systems from requirements through production.", path: "/about/", current: "about", body});
}

const GLOSSARY = [
    ["Artificial intelligence (AI)", "Software that can produce or analyze content from learned patterns. On this site, AI mainly describes how code was created or how a work system is used."],
    ["Application programming interface (API)", "A defined way for two software systems to request information or actions from each other."],
    ["Command-line interface (CLI)", "A program controlled by typed commands instead of on-screen buttons."],
    ["Continuous integration and continuous delivery (CI/CD)", "Automated checks and release steps that help teams test and publish software safely."],
    ["Data mapping", "Matching a field in one system, such as an order number, to the corresponding field in another system."],
    ["Deterministic simulation", "A simulation that produces the same result whenever it starts with the same data and actions."],
    ["Electronic data interchange (EDI)", "A standard way for businesses to exchange documents such as orders and shipping notices."],
    ["Enterprise resource planning (ERP)", "Business software used to manage areas such as orders, finance, inventory, and purchasing."],
    ["Extract, transform, and load (ETL)", "A process that reads data, reshapes or checks it, and writes it into another system."],
    ["International Electrotechnical Commission (IEC)", "An organization that develops international standards for electrical, electronic, and related technologies."],
    ["International Organization for Standardization (ISO)", "An organization that publishes international standards for management, technology, safety, and other fields."],
    ["Quality assurance (QA)", "Planned checking used to find problems and confirm that software meets its requirements."],
    ["Rollback architecture", "A game design that can restore an earlier state and calculate the same events again, which helps players stay synchronized online."],
    ["R2 object storage", "A Cloudflare service used to store files and backup copies."],
    ["System monitoring and observability", "Logs, measurements, and status information that help an operator understand what a running system is doing."],
    ["Web Content Accessibility Guidelines (WCAG)", "A published set of testable requirements for making web content more accessible to people with disabilities."],
    ["Warehouse management system (WMS)", "Software used to manage inventory and work inside a warehouse."],
    ["Content addressing", "Identifying a file by a digital fingerprint made from its contents rather than only by its name or location."],
    ["Billable cloud action", "An application action that uses a measured online service and can add to its operating cost."]
];

function glossary() {
  const glossaryMarkup = GLOSSARY.map(([term, definition]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>`).join("");
  const body = `<main class="case-main accessibility-main" id="main" tabindex="-1"><section class="page-hero"><p class="kicker">Glossary</p><h1>Technical terms.<br><span>Clear definitions.</span></h1><p>Definitions for the specialized language used throughout the portfolio.</p></section><section class="accessibility-section" id="glossary" aria-labelledby="glossary-heading"><div><p class="kicker">A–Z</p><h2 id="glossary-heading">Terms used on this site.</h2></div><dl class="glossary-list">${glossaryMarkup}</dl></section></main>`;
  return page({ title: "Glossary — WizardGang", description: "Clear definitions for technical terms and abbreviations used throughout Jacob Yongue's software engineering portfolio.", path: "/glossary/", current: "glossary", body});
}

function notFound() {
  const body = `<main class="site-main" id="main" tabindex="-1"><section class="not-found"><p class="kicker">404 / Route not found</p><h1>Nothing here.</h1><p>Return to Jacob Yongue’s portfolio or inspect the project index.</p><div class="button-row"><a class="button button-primary" href="/projects/">View projects <span aria-hidden="true">→</span></a><a class="button" href="/">Home</a></div></section></main>`;
  return page({ title: "Not Found — WizardGang", description: "That WizardGang portfolio page does not exist.", path: "/404/", body, noindex: true });
}

export function createPageDefinitions() {
  return new Map([
    ["index.html", home()],
    ["services/index.html", services()],
    ["about/index.html", about()],
    ["glossary/index.html", glossary()],
    ["404.html", notFound()]
  ]);
}

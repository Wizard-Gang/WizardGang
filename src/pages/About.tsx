import type { ReactPageDefinition } from "../app/contracts";
import { JACOB_TEAM_MEMBER, TEAM_MEMBERS } from "../data/team";

type AboutLocalSection = "about" | "company" | "team";

const ABOUT_LOCAL_ITEMS = [
  { key: "about", href: "/about/", label: "About" },
  { key: "company", href: "/about/company/", label: "Company" },
  { key: "team", href: "/about/team/", label: "Team" }
] as const;

function AboutLocalNavigation({
  current,
  teamChild = false
}: {
  current: AboutLocalSection;
  teamChild?: boolean;
}) {
  return (
    <nav className="about-local-nav" aria-label="About section">
      {ABOUT_LOCAL_ITEMS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={current === item.key ? (teamChild && item.key === "team" ? "location" : "page") : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export const ABOUT_PAGE: ReactPageDefinition = {
  relative: "about/index.html",
  metadata: {
    title: "About — WizardGang",
    description: "Learn about WizardGang as a company and the people behind its software, with company information and team experience kept clearly separated.",
    path: "/about/"
  },
  body: (
    <main className="case-main about-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <p className="kicker">About WizardGang</p>
        <h1>Company and people,<br /><span>clearly separated.</span></h1>
        <p>WizardGang keeps company information separate from the professional history of the people behind it. Start with the organization or meet the team.</p>
      </section>
      <AboutLocalNavigation current="about" />
      <section className="portfolio-section" aria-labelledby="about-paths-heading">
        <div className="section-heading">
          <div><p className="kicker">About structure</p><h2 id="about-paths-heading">Two clear authorities.</h2></div>
        </div>
        <div className="track-grid">
          <article>
            <span>01 / Company</span>
            <h3>WizardGang as an organization.</h3>
            <p>What WizardGang is, what it builds, and how its public claims stay tied to source, evidence, and current software.</p>
            <a className="text-link" href="/about/company/">About the company <span aria-hidden="true">→</span></a>
          </article>
          <article>
            <span>02 / Team</span>
            <h3>People behind the work.</h3>
            <p>The people behind WizardGang, with personal experience attributed to the person rather than presented as company client work.</p>
            <a className="text-link" href="/about/team/">Meet the team <span aria-hidden="true">→</span></a>
          </article>
        </div>
      </section>
    </main>
  )
};

export const COMPANY_PAGE: ReactPageDefinition = {
  relative: "about/company/index.html",
  metadata: {
    title: "Company — WizardGang",
    description: "About WizardGang: what it builds, how it keeps software and evidence inspectable, and how company claims stay distinct from team employment history.",
    path: "/about/company/"
  },
  body: (
    <main className="case-main about-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <p className="kicker">WizardGang company</p>
        <h1>Software with<br /><span>evidence close by.</span></h1>
        <p>WizardGang is a software organization focused on inspectable software, systems, integrations, and reusable engineering approaches. The company site summarizes the work and links to the source, case studies, and deeper evidence that support it.</p>
      </section>
      <AboutLocalNavigation current="company" />
      <section className="case-section">
        <div className="case-label">What WizardGang builds</div>
        <div>
          <h2>Software first.</h2>
          <p>WizardGang-owned projects are the clearest proof of what the organization builds. The Software section collects the current project and systems paths without turning employer work into company client history.</p>
          <a className="text-link" href="/software/">Explore software <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section className="case-section">
        <div className="case-label">Reusable approaches</div>
        <div>
          <h2>Solutions stay separate from products.</h2>
          <p>Solutions describe repeatable delivery approaches and frameworks WizardGang applies. Detailed solution content remains on its owning surface rather than being copied into Company.</p>
          <a className="text-link" href="/solutions/">Explore solutions <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section className="case-section">
        <div className="case-label">Claims &amp; evidence</div>
        <div>
          <h2>Keep ownership explicit.</h2>
          <p>Project claims stay tied to project source, case studies, live surfaces, or published evidence. Professional experience belongs to Team and Work. Employer and customer history is not presented as WizardGang client work.</p>
          <a className="text-link" href="/about/team/">Meet the team <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section className="case-section">
        <div className="case-label">Standards &amp; accessibility</div>
        <div>
          <h2>Demonstrate; do not overclaim.</h2>
          <p>WizardGang software includes documented accessibility work, and individual projects may document alignment with standards such as WCAG, ISO/IEC 27001, or ISO/IEC 42001. Those records do not become an organization-level certification claim.</p>
          <a className="text-link" href="https://demo.wizardgang.ai">Open architecture evidence <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </main>
  )
};

export const TEAM_PAGE: ReactPageDefinition = {
  relative: "about/team/index.html",
  metadata: {
    title: "Team — WizardGang",
    description: "Meet the people behind WizardGang and follow individual profiles without mixing personal career history into company claims.",
    path: "/about/team/"
  },
  body: (
    <main className="case-main about-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <p className="kicker">WizardGang team</p>
        <h1>People behind<br /><span>the work.</span></h1>
        <p>Team is the people authority for WizardGang. It can grow without changing the company information architecture; today it contains one current member.</p>
      </section>
      <AboutLocalNavigation current="team" />
      <section className="portfolio-section" aria-labelledby="team-members-heading">
        <div className="section-heading">
          <div><p className="kicker">Current team</p><h2 id="team-members-heading">One real member. No placeholders.</h2></div>
        </div>
        <div className="team-grid">
          {TEAM_MEMBERS.map((member) => (
            <article className="team-card" key={member.slug}>
              <span>{member.role}</span>
              <h3><a href={member.profilePath}>{member.name}</a></h3>
              <p>{member.summary}</p>
              <div className="text-links">
                <a className="text-link" href={member.profilePath}>View Jacob&apos;s profile <span aria-hidden="true">→</span></a>
                <a className="text-link" href={member.professionalPath}>Professional work <span aria-hidden="true">→</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
};

export const JACOB_TEAM_PAGE: ReactPageDefinition = {
  relative: "about/team/jacob/index.html",
  metadata: {
    title: "Jacob Yongue — WizardGang Team",
    description: "Jacob Yongue is the software engineer and implementation lead behind WizardGang. Read a concise profile and follow the current professional record.",
    path: "/about/team/jacob/"
  },
  body: (
    <main className="case-main about-main" id="main" tabIndex={-1}>
      <section className="page-hero about-hero">
        <p className="kicker">Team / Jacob Yongue</p>
        <h1>Build the whole path.<br /><span>Own the outcome.</span></h1>
        <div className="prose">
          <p>I’m a software engineer with an implementation background and a systems view of delivery. My work spans requirements, architecture, application development, integrations, QA, deployment, training, operational handoff, and production support.</p>
          <p>I’m most useful when the problem crosses boundaries: code and workflow, product and operations, technical design and project delivery. I make those boundaries explicit, learn the unfamiliar parts quickly, and keep evidence close enough that another person can understand what the system actually does.</p>
        </div>
      </section>
      <AboutLocalNavigation current="team" teamChild />
      <section className="about-principles" aria-labelledby="approach-heading">
        <div><p className="kicker">Approach</p><h2 id="approach-heading">Practical systems over isolated artifacts.</h2></div>
        <div className="principle-grid">
          <article><span>01</span><h3>Systems thinking</h3><p>Model the workflow, failure modes, ownership, and operating environment before optimizing an isolated component.</p></article>
          <article><span>02</span><h3>Implementation depth</h3><p>Stay hands-on through the code, integration, testing, deployment, adoption, and the edge cases production reveals.</p></article>
          <article><span>03</span><h3>Project ownership</h3><p>Make scope, risk, decisions, and handoff legible so progress survives team and technology boundaries.</p></article>
          <article><span>04</span><h3>Learning velocity</h3><p>Reduce unfamiliar technology to explicit contracts, inspectable behavior, and small verifiable steps.</p></article>
        </div>
      </section>
      <section className="case-section">
        <div className="case-label">Career detail</div>
        <div>
          <h2>Professional work remains separately attributed.</h2>
          <p>Detailed roles, projects, systems, integrations, deployments, and skills remain on the professional Work surface so this Team profile stays concise and attribution remains clear.</p>
          <a className="text-link" href={JACOB_TEAM_MEMBER.professionalPath}>View professional work <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
  )
};

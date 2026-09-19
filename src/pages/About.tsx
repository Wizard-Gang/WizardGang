import type { ReactPageDefinition } from "../app/contracts";

export const ABOUT_PAGE: ReactPageDefinition = {
  relative: "about/index.html",
  metadata: {
    title: "About Jacob Yongue — Software Engineer",
    description: "About Jacob Yongue: software engineer, implementation lead, systems thinker, and project owner focused on practical systems from requirements through production.",
    path: "/about/"
  },
  body: (
    <main className="case-main about-main" id="main" tabIndex={-1}>
      <section className="page-hero about-hero">
        <p className="kicker">About Jacob Yongue</p>
        <h1>Build the whole path.<br /><span>Own the outcome.</span></h1>
        <div className="prose">
          <p>I’m a software engineer with an implementation background and a systems view of delivery. My work spans requirements, architecture, application development, integrations, QA, deployment, training, operational handoff, and production support.</p>
          <p>I’m most useful when the problem crosses boundaries: code and workflow, product and operations, technical design and project delivery. I make those boundaries explicit, learn the unfamiliar parts quickly, and keep evidence close enough that another person can understand what the system actually does.</p>
        </div>
      </section>
      <section className="about-principles" aria-labelledby="approach-heading">
        <div><p className="kicker">Approach</p><h2 id="approach-heading">Practical systems over isolated artifacts.</h2></div>
        <div className="principle-grid">
          <article><span>01</span><h3>Systems thinking</h3><p>Model the workflow, failure modes, ownership, and operating environment before optimizing an isolated component.</p></article>
          <article><span>02</span><h3>Implementation depth</h3><p>Stay hands-on through the code, integration, testing, deployment, adoption, and the edge cases production reveals.</p></article>
          <article><span>03</span><h3>Project ownership</h3><p>Make scope, risk, decisions, and handoff legible so progress survives team and technology boundaries.</p></article>
          <article><span>04</span><h3>Learning velocity</h3><p>Reduce unfamiliar technology to explicit contracts, inspectable behavior, and small verifiable steps.</p></article>
        </div>
      </section>
    </main>
  )
};

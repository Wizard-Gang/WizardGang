import type { ReactPageDefinition } from "../app/contracts";

export const NOT_FOUND_PAGE: ReactPageDefinition = {
  relative: "404.html",
  metadata: {
    title: "Not Found — WizardGang",
    description: "That WizardGang page does not exist.",
    path: "/404/",
    noIndex: true
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="not-found">
        <p className="kicker">404 / Route not found</p>
        <h1>Nothing here.</h1>
        <p>Return to WizardGang or browse the software project catalog.</p>
        <div className="button-row">
          <a className="button button-primary" href="/software/projects/">View projects <span aria-hidden="true">→</span></a>
          <a className="button" href="/">Home</a>
        </div>
      </section>
    </main>
  )
};

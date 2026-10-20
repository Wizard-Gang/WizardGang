import type { ReactPageDefinition } from "../app/contracts";

export const NOT_FOUND_PAGE: ReactPageDefinition = {
  relative: "404.html",
  metadata: {
    title: "Not Found — WizardGang",
    description: "This WizardGang page does not exist. Return to the single-page site for services, experience and contact.",
    path: "/404/",
    noIndex: true
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="not-found">
        <p className="kicker">404 / Route not found</p>
        <h1>Nothing here.</h1>
        <p>That route is no longer part of this site. Everything is on the home page.</p>
        <div className="button-row">
          <a className="button button-primary" href="/">Home <span aria-hidden="true">→</span></a>
          <a className="button" href="/#contact">Contact <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
  )
};

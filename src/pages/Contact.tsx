import type { ReactPageDefinition } from "../app/contracts";
import { CONTACT_EMAIL } from "../data/site";

const GITHUB = "https://github.com/Wizard-Gang";
const LINKEDIN = "https://www.linkedin.com/in/jacob-yongue";

export const CONTACT_PAGE: ReactPageDefinition = {
  relative: "contact/index.html",
  metadata: {
    title: "Contact — WizardGang",
    description: "Reach WizardGang by email, or look through the source on GitHub first.",
    path: "/contact/",
    socialImage: "/og.jpg"
  },
  body: (
    <main className="site-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <h1>Contact</h1>
        <p>Tell me what you are trying to build, or what is already built and not behaving.</p>
      </section>

      <section className="contact-lines">
        <a className="outro-mail" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL} <span aria-hidden="true">→</span>
        </a>
        <ul className="contact-elsewhere">
          <li><a href={GITHUB}>GitHub <span aria-hidden="true">↗</span></a></li>
          <li><a href={LINKEDIN}>LinkedIn <span aria-hidden="true">↗</span></a></li>
        </ul>
      </section>
    </main>
  )
};

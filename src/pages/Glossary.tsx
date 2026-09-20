import type { ReactPageDefinition } from "../app/contracts";
import { GLOSSARY } from "../data/glossary";

export const GLOSSARY_PAGE: ReactPageDefinition = {
  relative: "glossary/index.html",
  metadata: {
    title: "Glossary — WizardGang",
    description: "Clear definitions for technical terms and abbreviations used throughout the WizardGang site.",
    path: "/glossary/"
  },
  body: (
    <main className="case-main accessibility-main" id="main" tabIndex={-1}>
      <section className="page-hero">
        <p className="kicker">Glossary</p>
        <h1>Technical terms.<br /><span>Clear definitions.</span></h1>
        <p>Definitions for the specialized language used throughout the WizardGang site.</p>
      </section>
      <section className="accessibility-section" id="glossary" aria-labelledby="glossary-heading">
        <div><p className="kicker">A–Z</p><h2 id="glossary-heading">Terms used on this site.</h2></div>
        <dl className="glossary-list">
          {GLOSSARY.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}
        </dl>
      </section>
    </main>
  )
};

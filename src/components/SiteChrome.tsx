import type { BuildMetadata, CurrentNavSection } from "../app/contracts";
import { NAVIGATION_ITEMS } from "../app/navigation";
import { GITHUB_ORG_URL, LINKEDIN_URL } from "../data/site";

interface NavigationProps {
  current: CurrentNavSection;
  mobile?: boolean;
  id?: string;
}

const MOBILE_NAVIGATION_ID = "primary-mobile-navigation";

export function Navigation({ current, mobile = false, id }: NavigationProps) {
  return (
    <nav id={id} className={mobile ? "site-nav site-nav-mobile" : "site-nav site-nav-desktop"} aria-label={mobile ? "Primary mobile" : "Primary"}>
      {NAVIGATION_ITEMS.map((item) => (
        <a key={item.key} href={item.href} aria-current={current === item.key ? "location" : undefined}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

/* One bar: wordmark, the inline navigation (from 48rem), then the gear and the
   phone menu button. The bar is a wrapper so the header itself can span the
   viewport while its contents keep the page width. */
export function SiteHeader({ current }: { current: CurrentNavSection }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header">
        <div className="site-header-bar">
          <a className="wordmark" href="/" aria-label="WizardGang home">
            <span className="wordmark-mark" aria-hidden="true"></span>
            <span className="wordmark-copy"><strong>WizardGang</strong><small>Jacob Yongue</small></span>
          </a>
          <Navigation current={current} />
          <div className="site-header-actions">
            <Preferences />
            <div className="nav-disclosure">
              <button
                className="nav-toggle"
                type="button"
                aria-expanded="false"
                aria-controls={MOBILE_NAVIGATION_ID}
                hidden
              >
                <span className="sr-only">Menu</span>
                <span className="nav-toggle-icon" aria-hidden="true"><i></i><i></i><i></i></span>
              </button>
              <Navigation current={current} mobile id={MOBILE_NAVIGATION_ID} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export function Preferences() {
  return (
    <details className="prefs">
      <summary aria-label="Display and language preferences" title="Preferences">
        <svg className="prefs-gear" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      </summary>
      <section className="settings-toolbar" aria-label="Language and display preferences">
        <label className="setting-language">
          <span>Language</span>
          <select id="page-language" autoComplete="off">
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
        <fieldset className="setting-theme">
          <legend>Theme</legend>
          <div className="setting-segments">
            <label><input type="radio" name="page-theme" id="theme-dark" /> Dark</label>
            <label><input type="radio" name="page-theme" id="theme-light" defaultChecked /> Light</label>
          </div>
        </fieldset>
        <div className="setting-switches">
          <label className="setting-toggle"><input type="checkbox" id="reading-layout" defaultChecked /><span>Readable layout</span></label>
          <label className="setting-toggle"><input type="checkbox" id="text-size-200" /><span>200% text</span></label>
        </div>
      </section>
    </details>
  );
}

export function SiteFooter({ build }: { build: BuildMetadata }) {
  const buildLabel = build.commit === "development" ? build.commit : build.commit.slice(0, 12);
  return (
    <footer className="site-footer">
      <p className="footer-brand"><span className="wordmark-mark" aria-hidden="true"></span>WizardGang · Software, systems &amp; integrations</p>
      <p className="footer-contact">
        <a href={LINKEDIN_URL}>LinkedIn <span aria-hidden="true">↗</span></a>
        <a href={GITHUB_ORG_URL} aria-label="Visit WizardGang on GitHub">GitHub <span aria-hidden="true">↗</span></a>
      </p>
      <p className="footer-build">WizardGang.ai · <a href="/version.json">Build <span className="footer-hash">{buildLabel}</span></a></p>
    </footer>
  );
}

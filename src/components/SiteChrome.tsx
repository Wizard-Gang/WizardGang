import type { BuildMetadata, CurrentNavSection } from "../app/contracts";
import { NAVIGATION_ITEMS } from "../app/navigation";

const GITHUB = "https://github.com/Wizard-Gang";
const LINKEDIN = "https://www.linkedin.com/in/jacob-yongue";
const CONTACT_EMAIL = "jacob@wizardgang.ai";

interface NavigationProps {
  current: CurrentNavSection;
  mobile?: boolean;
  id?: string;
}

const MOBILE_NAVIGATION_ID = "primary-mobile-navigation";

export function Navigation({ current, mobile = false, id }: NavigationProps) {
  return (
    <nav id={id} className={mobile ? "site-nav site-nav-mobile" : "site-nav site-nav-desktop"} aria-label={mobile ? "Primary mobile" : "Primary"}>
      {NAVIGATION_ITEMS.map((item) => {
        if (!("items" in item) || !item.items) {
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={current === item.key ? "location" : undefined}
            >
              {item.label}
            </a>
          );
        }
        /* A disclosure, not a scripted menu: it opens with the keyboard and
           without JavaScript, and every destination is a real link underneath. */
        return (
          <details className="nav-menu" key={item.key}>
            <summary aria-current={current === item.key ? "location" : undefined}>
              {item.label}
              <span className="nav-menu-caret" aria-hidden="true">
                <svg viewBox="0 0 16 16" focusable="false"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </summary>
            <ul>
              {item.items.map((entry) => (
                <li key={entry.href}>
                  <a href={entry.href} aria-label={entry.accessibleName}>{entry.label}</a>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </nav>
  );
}

export function SiteHeader({ current }: { current: CurrentNavSection }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="WizardGang home">
          <span className="wordmark-mark" aria-hidden="true"></span>
          <span className="wordmark-copy"><strong>WIZARDGANG</strong><small>Jacob Yongue</small></span>
        </a>
        <Navigation current={current} />
        <div className="nav-disclosure">
          <button
            className="nav-toggle"
            type="button"
            aria-expanded="false"
            aria-controls={MOBILE_NAVIGATION_ID}
            hidden
          >
            <span>Menu</span>
            <span className="nav-toggle-icon" aria-hidden="true"><i></i><i></i><i></i></span>
          </button>
          <Navigation current={current} mobile id={MOBILE_NAVIGATION_ID} />
        </div>
      </header>
    </>
  );
}

export function Preferences() {
  return (
    <details className="display-settings">
      <summary>Preferences</summary>
      <section className="settings-toolbar" aria-label="Language, display, and motion preferences">
        <label className="setting-language">
          <span>Language</span>
          <select id="page-language" autoComplete="off">
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
        <fieldset className="setting-theme">
          <legend>Theme</legend>
          <label><input type="radio" name="page-theme" id="theme-dark" defaultChecked /> Dark</label>
          <label><input type="radio" name="page-theme" id="theme-light" /> Light</label>
        </fieldset>
        <label className="setting-toggle"><input type="checkbox" id="reading-layout" defaultChecked /><span>Readable layout</span></label>
        <label className="setting-toggle"><input type="checkbox" id="text-size-200" /><span>200% text</span></label>
        <label className="setting-toggle"><input type="checkbox" id="play-previews" aria-describedby="motion-setting-help" defaultChecked /><span>Play previews</span></label>
        <small className="sr-only" id="motion-setting-help">Previews play by default. Turn this off to pause them; reduced-motion preferences are always respected.</small>
      </section>
    </details>
  );
}

export function SiteFooter({ build }: { build: BuildMetadata }) {
  return (
    <footer className="site-footer">
      <span>WizardGang · Software, systems &amp; integrations</span>
      <span className="footer-contact">
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <a href={LINKEDIN}>LinkedIn <span aria-hidden="true">↗</span></a>
        <a href={GITHUB} aria-label="Visit WizardGang on GitHub">GitHub <span aria-hidden="true">↗</span></a>
      </span>
      <span>WizardGang.ai · <a href="/version.json">Build {build.commit}</a></span>
    </footer>
  );
}

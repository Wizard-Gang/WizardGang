import type { BuildMetadata, CurrentNavSection } from "../app/contracts";
import { NAVIGATION_ITEMS } from "../app/navigation";
import { DEMO_SOURCE_URL, DEMO_URL, SITE_SOURCE_URL } from "../data/site";

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
            <span className="wordmark-copy"><strong>WizardGang</strong></span>
          </a>
          <Navigation current={current} />
          <div className="site-header-actions">
            <a className="header-icon-link" href={DEMO_URL} aria-label="Architecture demo" title="Architecture demo">
              <svg className="outline-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5.5 4.5h13a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17V7a2.5 2.5 0 0 1 2.5-2.5zM3 8.5h18M10.5 11.5v5l4-2.5z" />
              </svg>
            </a>
            <a className="header-icon-link" href={DEMO_SOURCE_URL} aria-label="Demo source on GitHub" title="Demo source on GitHub">
              <svg className="github-mark" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
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

/* Only a release build carries a published semantic version, and only a Git
   checkout carries a commit; otherwise the footer shows the labels alone. */
export function SiteFooter({ build }: { build: BuildMetadata }) {
  const published = /^\d+\.\d+\.\d+$/.test(build.release);
  const committed = /^[0-9a-f]{40}$/.test(build.commit);
  const version = `v${build.release}`;
  const shortCommit = committed ? build.commit.slice(0, 7) : build.commit;
  const year = new Date(build.builtAt).getUTCFullYear();
  return (
    <footer className="site-footer">
      <p className="footer-brand"><span className="wordmark-mark" aria-hidden="true"></span>WizardGang</p>
      <p className="footer-links">
        <a href={DEMO_SOURCE_URL}>Demo source <span aria-hidden="true">↗</span></a>
        <a href={`${DEMO_URL}/demos#accessibility`}>Accessibility <span aria-hidden="true">↗</span></a>
        <a href={`${DEMO_URL}/security`}>Security <span aria-hidden="true">↗</span></a>
      </p>
      <p className="footer-build">
        <span>© {year} WizardGang</span>
        <span aria-hidden="true">·</span>
        {published ? <a href={`${SITE_SOURCE_URL}/releases/tag/${version}`} title="Release">{version}</a> : <span>{version}</span>}
        <span aria-hidden="true">·</span>
        {committed ? <a className="footer-hash" href={`${SITE_SOURCE_URL}/commit/${build.commit}`} title="Build commit">{shortCommit}</a> : <span className="footer-hash">{shortCommit}</span>}
      </p>
    </footer>
  );
}

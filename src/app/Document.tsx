import { renderToStaticMarkup } from "react-dom/server";
import { Preferences, SiteFooter, SiteHeader } from "../components/SiteChrome";
import type { BuildMetadata, PageDefinition, PageMetadata } from "./contracts";

const SITE_ORIGIN = "https://wizardgang.ai";
const DEFAULT_SOCIAL_IMAGE = "/og-jacob-yongue.jpg";
const SOCIAL_IMAGE_ALT = "Jacob Yongue — software engineer, systems integration, project delivery";
const LEGACY_BODY_PLACEHOLDER = '<template data-wizardgang-legacy-body=""></template>';

function Metadata({ metadata, build }: { metadata: PageMetadata; build: BuildMetadata }) {
  const canonical = `${SITE_ORIGIN}${metadata.path}`;
  const assetVersion = encodeURIComponent(`${build.commit}-${Date.parse(build.builtAt)}`);
  const socialImage = metadata.socialImage ? new URL(metadata.socialImage, SITE_ORIGIN).toString() : null;

  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="theme-color" content="#08080b" />
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {metadata.noIndex ? (
        <meta name="robots" content="noindex" />
      ) : (
        <>
          <link rel="canonical" href={canonical} />
          <meta property="og:url" content={canonical} />
        </>
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="WizardGang" />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      {socialImage ? (
        <>
          <meta property="og:image" content={socialImage} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={SOCIAL_IMAGE_ALT} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={socialImage} />
        </>
      ) : (
        <meta name="twitter:card" content="summary" />
      )}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="stylesheet" href={`/assets/styles.css?v=${assetVersion}`} />
      <script src={`/assets/site.js?v=${assetVersion}`} defer></script>
    </head>
  );
}

export function Document({ page, build }: { page: PageDefinition; build: BuildMetadata }) {
  return (
    <html lang="en">
      <Metadata metadata={page.metadata} build={build} />
      <body>
        <SiteHeader current={page.current} />
        <Preferences />
        <template data-wizardgang-legacy-body=""></template>
        <SiteFooter build={build} />
      </body>
    </html>
  );
}

export function renderDocument(page: PageDefinition, build: BuildMetadata): string {
  const shell = renderToStaticMarkup(<Document page={page} build={build} />);
  if (!shell.includes(LEGACY_BODY_PLACEHOLDER)) {
    throw new Error("React shell did not emit the legacy body compatibility boundary.");
  }

  // WG-041 transitional boundary: every page body is trusted repository-authored HTML
  // from src/site.mjs. Replacing one exact inert placeholder preserves the existing DOM
  // shape without spreading raw-HTML injection across React components. Later WG changes
  // will replace these body strings with React page components.
  return `<!doctype html>\n${shell.replace(LEGACY_BODY_PLACEHOLDER, page.body)}`;
}

export const SOCIAL_IMAGE = DEFAULT_SOCIAL_IMAGE;
export type { BuildMetadata, PageDefinition, PageMetadata } from "./contracts";

import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Preferences, SiteFooter, SiteHeader } from "../components/SiteChrome";
import { SelectedProjectsSection, createProjectPageDefinitions } from "../pages/Projects";
import type { BuildMetadata, PageDefinition, PageMetadata } from "./contracts";

const SITE_ORIGIN = "https://wizardgang.ai";
const DEFAULT_SOCIAL_IMAGE = "/og-jacob-yongue.jpg";
const SOCIAL_IMAGE_ALT = "Jacob Yongue — software engineer, systems integration, project delivery";
const LEGACY_BODY_PLACEHOLDER = '<template data-wizardgang-legacy-body=""></template>';
const SELECTED_PROJECTS_PLACEHOLDER = '<template data-wizardgang-selected-projects=""></template>';

function Metadata({ metadata, build, browserAssetPath }: { metadata: PageMetadata; build: BuildMetadata; browserAssetPath: string }) {
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
      <script type="module" src={browserAssetPath}></script>
    </head>
  );
}

export function Document({
  page,
  build,
  browserAssetPath,
  children
}: {
  page: Pick<PageDefinition, "metadata" | "current">;
  build: BuildMetadata;
  browserAssetPath: string;
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <Metadata metadata={page.metadata} build={build} browserAssetPath={browserAssetPath} />
      <body>
        <SiteHeader current={page.current} />
        <Preferences />
        {children}
        <SiteFooter build={build} />
      </body>
    </html>
  );
}

function renderStaticDocument(
  page: Pick<PageDefinition, "metadata" | "current">,
  body: ReactNode,
  build: BuildMetadata,
  browserAssetPath: string
): string {
  return `<!doctype html>\n${renderToStaticMarkup(
    <Document page={page} build={build} browserAssetPath={browserAssetPath}>{body}</Document>
  )}`;
}

export function renderDocument(page: PageDefinition, build: BuildMetadata, browserAssetPath: string): string {
  let legacyBody = page.body;
  if (legacyBody.includes(SELECTED_PROJECTS_PLACEHOLDER)) {
    legacyBody = legacyBody.replace(
      SELECTED_PROJECTS_PLACEHOLDER,
      renderToStaticMarkup(<SelectedProjectsSection />)
    );
  }

  const shell = renderStaticDocument(
    page,
    <template data-wizardgang-legacy-body=""></template>,
    build,
    browserAssetPath
  );
  if (!shell.includes(LEGACY_BODY_PLACEHOLDER)) {
    throw new Error("React shell did not emit the legacy body compatibility boundary.");
  }

  // Remaining legacy page bodies are trusted repository-authored HTML from src/site.mjs.
  // Project surfaces are React-owned; Home receives only the shared React project section
  // through one exact build-time slot until the rest of Home migrates in a later WG change.
  return shell.replace(LEGACY_BODY_PLACEHOLDER, legacyBody);
}

export function renderProjectDocuments(build: BuildMetadata, browserAssetPath: string): Map<string, string> {
  return new Map(
    createProjectPageDefinitions().map((page) => [
      page.relative,
      renderStaticDocument(page, page.body, build, browserAssetPath)
    ])
  );
}

export const SOCIAL_IMAGE = DEFAULT_SOCIAL_IMAGE;
export type { BuildMetadata, PageDefinition, PageMetadata } from "./contracts";

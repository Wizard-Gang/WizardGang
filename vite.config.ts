import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import type { BuildMetadata, PageDefinition } from "./src/app/contracts";
import { sanitizeLocalHeadersText } from "./scripts/local-headers.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const dist = resolve(root, "dist");
const shellOut = resolve(root, "tmp/frontend-shell");
const rendererFile = resolve(shellOut, "render.mjs");
const siteModule = resolve(root, "src/site.mjs");

function gitCommit(): string {
  if (process.env.BUILD_COMMIT) return process.env.BUILD_COMMIT.slice(0, 12);
  try {
    return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "development";
  }
}

function staticSitePlugin(): Plugin {
  let generation = 0;
  const watched = [
    siteModule,
    resolve(root, "src/projects.mjs"),
    resolve(root, "src/professional.mjs"),
    resolve(root, "src/professional-systems.mjs"),
    resolve(root, "src/styles.css"),
    resolve(root, "src/portfolio-cleanup.css")
  ];

  return {
    name: "wizardgang-static-react-shell",
    buildStart() {
      for (const file of watched) this.addWatchFile(file);
    },
    async writeBundle() {
      generation += 1;

      const rendererUrl = `${pathToFileURL(rendererFile).href}?generation=${generation}`;
      const siteUrl = `${pathToFileURL(siteModule).href}?generation=${generation}`;
      const renderer = await import(rendererUrl) as {
        renderDocument(page: PageDefinition, build: BuildMetadata): string;
      };
      const legacy = await import(siteUrl) as {
        createPageDefinitions(): Map<string, PageDefinition>;
      };

      const build: BuildMetadata = {
        product: "WizardGang Portfolio",
        commit: gitCommit(),
        builtAt: new Date().toISOString()
      };

      await rm(dist, { recursive: true, force: true });
      await mkdir(dist, { recursive: true });
      await cp(resolve(root, "public"), dist, { recursive: true });
      if (process.env.WIZARDGANG_LOCAL_DEV === "1") {
        const headersPath = resolve(dist, "_headers");
        const headers = await readFile(headersPath, "utf8");
        await writeFile(headersPath, sanitizeLocalHeadersText(headers));
      }
      await mkdir(resolve(dist, "assets"), { recursive: true });

      const baseStyles = await readFile(resolve(root, "src/styles.css"), "utf8");
      const portfolioStyles = await readFile(resolve(root, "src/portfolio-cleanup.css"), "utf8");
      await writeFile(resolve(dist, "assets/styles.css"), `${baseStyles.trim()}\n\n${portfolioStyles.trim()}\n`);

      const pages = legacy.createPageDefinitions();
      for (const [relative, page] of pages) {
        const target = resolve(dist, relative);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, renderer.renderDocument(page, build));
      }

      await writeFile(resolve(dist, "version.json"), `${JSON.stringify(build, null, 2)}\n`);
      console.log(`Built ${pages.size} React-shell HTML pages at ${build.commit}.`);
    }
  };
}

export default defineConfig({
  appType: "custom",
  publicDir: false,
  plugins: [react(), tailwindcss(), staticSitePlugin()],
  build: {
    ssr: "src/app/Document.tsx",
    outDir: shellOut,
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        entryFileNames: "render.mjs"
      }
    }
  }
});

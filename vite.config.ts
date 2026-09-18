import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const foundationRoot = fileURLToPath(new URL("./src/app/foundation/", import.meta.url));
const foundationOut = fileURLToPath(new URL("./tmp/frontend-foundation/", import.meta.url));

export default defineConfig({
  root: foundationRoot,
  base: "./",
  appType: "mpa",
  publicDir: false,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: foundationOut,
    emptyOutDir: true,
    assetsInlineLimit: 0
  }
});

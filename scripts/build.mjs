import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));

await build({
  configFile: resolve(root, "vite.config.ts")
});

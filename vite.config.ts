import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { copyFileSync, existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const path = (file: string) => fileURLToPath(new URL(file, import.meta.url));

function previewAsIndexPlugin(): Plugin {
  const promotePreviewToIndex = () => {
    const distDir = path("./dist");
    const landingPath = resolve(distDir, "landing.html");
    const indexPath = resolve(distDir, "index.html");

    if (existsSync(landingPath)) {
      copyFileSync(landingPath, indexPath);
      unlinkSync(landingPath);
    }
  };

  return {
    name: "preview-as-index",
    enforce: "post",
    generateBundle(_, bundle) {
      const landingKey = bundle["landing.html"]
        ? "landing.html"
        : Object.keys(bundle).find((key) => key.endsWith("landing.html"));

      if (landingKey && bundle[landingKey]) {
        const landing = bundle[landingKey];
        if (landing.type === "asset") {
          this.emitFile({
            type: "asset",
            fileName: "index.html",
            source: landing.source,
          });
          delete bundle[landingKey];
        }
      }
    },
    writeBundle() {
      promotePreviewToIndex();
    },
    closeBundle() {
      promotePreviewToIndex();
    },
  };
}

// The workbench in apps/preview serves the app; `@/` imports reach the skin in src/.
export default defineConfig({
  root: path("./apps/preview"),
  // Relative URLs, so the build works at a domain root or in a subfolder such as GitHub Pages.
  base: "./",
  plugins: [
    tailwindcss(),
    react(),
    cloudflare({ viteEnvironment: { name: "worker" } }),
    previewAsIndexPlugin(),
  ],
  resolve: {
    alias: {
      "@preview": path("./apps/preview/src"),
      "@": path("./src"),
    },
  },
  server: {
    fs: { allow: [path(".")] },
  },
  build: {
    outDir: path("./dist"),
    emptyOutDir: true,
    rollupOptions: {
      // Build the storybook landing page as index.html while keeping the bare player preview at preview.html.
      input: {
        landing: path("./apps/preview/landing.html"),
        preview: path("./apps/preview/preview.html"),
      },
    },
    rolldownOptions: {
      input: {
        landing: path("./apps/preview/landing.html"),
        preview: path("./apps/preview/preview.html"),
      },
    },
  },
  environments: {
    worker: { build: { sourcemap: true } },
  },
});

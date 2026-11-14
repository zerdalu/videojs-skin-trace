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
    const previewPath = resolve(distDir, "preview.html");
    const indexPath = resolve(distDir, "index.html");

    if (existsSync(previewPath)) {
      copyFileSync(previewPath, indexPath);
      unlinkSync(previewPath);
    }
  };

  return {
    name: "preview-as-index",
    enforce: "post",
    generateBundle(_, bundle) {
      const previewKey = bundle["preview.html"]
        ? "preview.html"
        : Object.keys(bundle).find((key) => key.endsWith("preview.html"));

      if (previewKey && bundle[previewKey]) {
        const preview = bundle[previewKey];
        if (preview.type === "asset") {
          this.emitFile({
            type: "asset",
            fileName: "index.html",
            source: preview.source,
          });
          delete bundle[previewKey];
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
      // Build only the player preview, which is promoted to index.html in dist.
      input: {
        preview: path("./apps/preview/preview.html"),
      },
    },
    rolldownOptions: {
      input: {
        preview: path("./apps/preview/preview.html"),
      },
    },
  },
  environments: {
    worker: { build: { sourcemap: true } },
  },
});

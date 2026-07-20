import { preact } from "@preact/preset-vite"
import path from "node:path"
import tailwindcss from "tailwindcss"
import { defineConfig } from "vite"
import { buildRoutesPlugin } from "./build-routes.ts"

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@thoth": path.resolve(import.meta.dirname, "src"),
    },
  },
  plugins: [buildRoutesPlugin(), preact()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
})

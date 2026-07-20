import { preact } from "@preact/preset-vite"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import { defineConfig } from "vite"
import { buildRoutesPlugin } from "./build-routes.ts"

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@thoth": path.resolve(import.meta.dirname, "src"),
    },
  },
  plugins: [buildRoutesPlugin(), tailwindcss(), preact()],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
})

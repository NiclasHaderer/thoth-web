import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"
import { buildRoutesPlugin } from "./build-routes.ts"
import pkg from "./package.json" with { type: "json" }

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      "@thoth": path.resolve(import.meta.dirname, "src"),
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  plugins: [buildRoutesPlugin(), tailwindcss(), react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
})

import { preact } from "@preact/preset-vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "tailwindcss"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { buildRoutesPlugin } from "./build-routes.ts"

const shouldUsePreact = !!process.env.USE_PREACT
const reactPlugin = shouldUsePreact ? preact : react
console.log("Using preact:", shouldUsePreact)

// https://vite.dev/config/
export default defineConfig({
  plugins: [buildRoutesPlugin(), tsconfigPaths(), reactPlugin()],
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

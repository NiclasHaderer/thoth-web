import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "tailwindcss"
import tsconfigPaths from "vite-tsconfig-paths"
import { preact } from "@preact/preset-vite"

const shouldUsePreact = !!process.env.USE_PREACT
const reactPlugin = shouldUsePreact ? preact : react
console.log("Using preact:", shouldUsePreact)

// https://vite.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), reactPlugin()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})

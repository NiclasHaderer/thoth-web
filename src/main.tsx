import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Routes } from "@thoth/routes.tsx"

if (import.meta.env.DEV) {
  await import("preact/debug")
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Routes />
  </StrictMode>
)

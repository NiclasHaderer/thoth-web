import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Routes } from "@thoth/routes.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Routes />
  </StrictMode>
)

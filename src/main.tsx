import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "@thoth/components/ui/sonner.tsx"
import { Routes } from "@thoth/routes.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Routes />
    <Toaster />
  </StrictMode>
)

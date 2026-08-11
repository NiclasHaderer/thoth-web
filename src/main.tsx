import { StrictMode } from "react"
import { RouterProvider } from "react-aria-components"
import { createRoot } from "react-dom/client"
import { navigate } from "wouter/use-hash-location"
import { Toaster } from "@thoth/components/ui/sonner.tsx"
import { Routes } from "@thoth/routes.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider navigate={to => navigate(to)} useHref={href => `#${href}`}>
      <Routes />
      <Toaster position="top-center" />
    </RouterProvider>
  </StrictMode>
)

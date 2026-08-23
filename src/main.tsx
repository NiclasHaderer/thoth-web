import { QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { RouterProvider } from "react-aria-components"
import { createRoot } from "react-dom/client"
import { navigate } from "wouter/use-browser-location"
import { queryClient } from "@thoth/client/query-client"
import { Toaster } from "@thoth/components/ui/sonner.tsx"
import { Routes } from "@thoth/routes.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider navigate={to => navigate(to)}>
        <Routes />
        <Toaster position="top-center" />
      </RouterProvider>
    </QueryClientProvider>
  </StrictMode>
)

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { StrictMode } from "react"
import { RouterProvider } from "react-aria-components"
import { createRoot } from "react-dom/client"
import { navigate } from "wouter/use-browser-location"
import { CACHE_BUSTER, persister } from "@thoth/client/persistence"
import { queryClient } from "@thoth/client/query-client"
import { Toaster } from "@thoth/components/ui/sonner.tsx"
import { Routes } from "@thoth/routes.tsx"
import { UserDataProvider } from "@thoth/state/user-data"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserDataProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: Infinity,
          buster: CACHE_BUSTER,
          dehydrateOptions: {
            shouldDehydrateQuery: query => query.state.data !== undefined && query.meta?.persist !== false,
          },
        }}
      >
        <RouterProvider navigate={to => navigate(to)}>
          <Routes />
          <Toaster position="top-center" />
        </RouterProvider>
      </PersistQueryClientProvider>
    </UserDataProvider>
  </StrictMode>
)

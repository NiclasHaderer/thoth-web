import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { isAuthError } from "./error"

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: { action: string }
    mutationMeta: { action: string }
  }
}

const report = (error: Error, action: string | undefined) => {
  if (isAuthError(error)) return
  const headline = action ? `Could not ${action}` : "Something went wrong"
  const detail = error.message && error.message !== headline ? `: ${error.message}` : ""
  toast.error(`${headline}${detail}`, { id: error.message || headline })
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => report(error, query.meta?.action),
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => report(error, mutation.meta?.action),
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

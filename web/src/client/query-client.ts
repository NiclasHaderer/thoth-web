import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { isAuthError, isNetworkError, isNotFoundError } from "./error"

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: { action: string; persist?: false }
    mutationMeta: { action: string }
  }
}

const report = (error: Error, action: string | undefined) => {
  if (isAuthError(error)) {
    const expired = "Your session expired. Please log in again."
    toast.error(expired, { id: expired })
    return
  }
  const headline = action ? `Could not ${action}` : "Something went wrong"
  const detail = isNetworkError(error)
    ? ", you are offline"
    : error.message && error.message !== headline
      ? `: ${error.message}`
      : ""
  toast.error(`${headline}${detail}`, { id: error.message || headline })
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (isNetworkError(error) || isNotFoundError(error)) return
      report(error, query.meta?.action)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => report(error, mutation.meta?.action),
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
      networkMode: "offlineFirst",
    },
    mutations: {
      networkMode: "offlineFirst",
    },
  },
})

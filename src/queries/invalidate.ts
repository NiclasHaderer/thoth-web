import { QueryClient } from "@tanstack/react-query"
import { UUID } from "@thoth/client"
import { queryKeys } from "./keys"

// A book edit can move it between series and authors, rename its narrators and
// change its genres, so anything scoped to the library is suspect - plus the
// cross-library search index.
export const invalidateLibraryContent = (queryClient: QueryClient, libraryId: UUID) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.library(libraryId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.librarySearches }),
  ])

// Library names and access are embedded in both the current user and the user
// table, so they go stale whenever a library is created, renamed or removed.
export const invalidateLibraryMembership = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.libraries }),
    queryClient.invalidateQueries({ queryKey: queryKeys.currentUser }),
    queryClient.invalidateQueries({ queryKey: queryKeys.users }),
  ])

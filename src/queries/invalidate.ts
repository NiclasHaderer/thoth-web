import { QueryClient } from "@tanstack/react-query"
import { UUID } from "@thoth/client"
import { queryKeys } from "./keys"

export const invalidateLibraryContent = (queryClient: QueryClient, libraryId: UUID) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.library(libraryId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.librarySearches }),
  ])

export const invalidateLibraryMembership = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.libraries }),
    queryClient.invalidateQueries({ queryKey: queryKeys.currentUser }),
    queryClient.invalidateQueries({ queryKey: queryKeys.users }),
  ])

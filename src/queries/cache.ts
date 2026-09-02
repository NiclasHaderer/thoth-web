import { QueryClient } from "@tanstack/react-query"
import { Book, PaginatedResponse, UUID } from "@thoth/client"
import { EntityQueries, Identifiable, queries } from "./queries"

export const invalidateLibraryContent = (queryClient: QueryClient, libraryId: UUID) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queries.library(libraryId) }),
    queryClient.invalidateQueries({ queryKey: queries.librarySearches }),
  ])

export const invalidatePlayState = (queryClient: QueryClient, libraryId: UUID) =>
  Promise.all([
    invalidateLibraryContent(queryClient, libraryId),
    queryClient.invalidateQueries({ queryKey: queries.continueListening.queryKey }),
  ])

export const invalidateMembership = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queries.libraries.queryKey }),
    queryClient.invalidateQueries({ queryKey: queries.currentUser.queryKey }),
    queryClient.invalidateQueries({ queryKey: queries.users.queryKey }),
  ])

export const cachedListItem = <T extends Identifiable, D extends T>(
  queryClient: QueryClient,
  group: EntityQueries<T, D>,
  libraryId: UUID,
  id: UUID
): T | undefined => {
  const pages = queryClient.getQueriesData<PaginatedResponse<T>>({ queryKey: group.lists(libraryId) })
  for (const [, page] of pages) {
    const hit = page?.items.find(item => item.id === id)
    if (hit) return hit
  }
  return queryClient.getQueryData(group.all(libraryId).queryKey)?.find(item => item.id === id)
}

// Whatever the caches currently claim about a book, from the detail entry or from any list.
export const cachedBook = (queryClient: QueryClient, libraryId: UUID, id: UUID): Book | undefined =>
  queryClient.getQueryData(queries.books.detail(libraryId, id).queryKey) ??
  cachedListItem(queryClient, queries.books, libraryId, id)

// Applies a partial update to every cache that holds the entity: the detail entry, all list
// pages and the full list. Callers still invalidate afterwards so server-derived data catches up.
export const patchEntity = <T extends Identifiable, D extends T>(
  queryClient: QueryClient,
  group: EntityQueries<T, D>,
  libraryId: UUID,
  id: UUID,
  merge: (item: T) => Partial<T>
) => {
  const apply = <I extends T>(item: I): I => (item.id === id ? { ...item, ...merge(item) } : item)
  queryClient.setQueryData(group.detail(libraryId, id).queryKey, previous => previous && apply(previous))
  queryClient.setQueriesData<PaginatedResponse<T>>(
    { queryKey: group.lists(libraryId) },
    page => page && { ...page, items: page.items.map(apply) }
  )
  queryClient.setQueryData(group.all(libraryId).queryKey, list => list?.map(apply))
}

export const patchBook = (
  queryClient: QueryClient,
  libraryId: UUID,
  id: UUID,
  merge: (book: Book) => Partial<Book>
) => {
  patchEntity(queryClient, queries.books, libraryId, id, merge)
  queryClient.setQueryData(queries.continueListening.queryKey, list =>
    list?.map(book => (book.id === id ? { ...book, ...merge(book) } : book))
  )
}

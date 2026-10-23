import { QueryClient } from "@tanstack/react-query"
import { Book, LibrarySearchResult, PaginatedResponse, UUID } from "@thoth/client"
import { EntityQueries, Identifiable, queries } from "./query-definitions"

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
): T | undefined =>
  queryClient
    .getQueriesData<PaginatedResponse<T>>({ queryKey: group.lists(libraryId) })
    .flatMap(([, page]) => page?.items ?? [])
    .find(item => item.id === id)

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

const RESULT_LIMIT = 25

const matches = (haystack: string | undefined, needle: string) => !!haystack?.toLowerCase().includes(needle)

const cachedEntities = <T extends Identifiable, D extends T>(
  queryClient: QueryClient,
  group: EntityQueries<T, D>
): T[] => {
  const byId = new Map<UUID, T>()
  const collect = (item: T | undefined) => item && byId.set(item.id, item)

  for (const { id: libraryId } of queryClient.getQueryData(queries.libraries.queryKey) ?? []) {
    for (const [, page] of queryClient.getQueriesData<PaginatedResponse<T>>({ queryKey: group.lists(libraryId) })) {
      page?.items.forEach(collect)
    }
    for (const [, item] of queryClient.getQueriesData<D>({ queryKey: group.details(libraryId) })) collect(item)
  }
  return [...byId.values()]
}

export const cachedLibrarySearch = (queryClient: QueryClient, q: string): LibrarySearchResult => {
  const needle = q.trim().toLowerCase()
  if (!needle) return { books: [], authors: [], series: [] }

  const continueListening = queryClient.getQueryData(queries.continueListening.queryKey) ?? []
  const books = new Map<UUID, Book>()
  for (const book of [...cachedEntities(queryClient, queries.books), ...continueListening]) books.set(book.id, book)

  return {
    books: [...books.values()]
      .filter(book => matches(book.title, needle) || book.authors.some(author => matches(author.name, needle)))
      .slice(0, RESULT_LIMIT),
    authors: cachedEntities(queryClient, queries.authors)
      .filter(author => matches(author.name, needle))
      .slice(0, RESULT_LIMIT),
    series: cachedEntities(queryClient, queries.series)
      .filter(series => matches(series.title, needle))
      .slice(0, RESULT_LIMIT),
  }
}

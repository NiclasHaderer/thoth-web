import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import {
  Api,
  Author,
  AuthorCreate,
  AuthorDetailed,
  AuthorUpdate,
  Book,
  BookDetailed,
  BookUpdate,
  Order,
  Series,
  SeriesCreate,
  SeriesDetailed,
  SeriesUpdate,
  UUID,
} from "@thoth/client"
import { stopWithoutSync } from "@thoth/playback/controller"
import { usePlayback } from "@thoth/playback/state"
import { cachedListItem, invalidateLibraryContent, invalidatePlayState, patchBook, patchEntity } from "./cache"
import { usePagedList } from "./paged-list"
import { EntityQueries, Identifiable, NameResource, PagedQueries, queries } from "./queries"

type UpdateFn<U, R> = (params: { libraryId: UUID; id: UUID }, body: U) => Promise<R>
type AutoMatchFn<R> = (params: { libraryId: UUID; id: UUID }) => Promise<R>
type CreateFn<C, R> = (params: { libraryId: UUID }, body: C) => Promise<R>

// Shares page zero with the full list, so opening a library warms the list the reader lands on next.
const useResourcePreview = <T>(group: PagedQueries<T>, libraryId: UUID) =>
  useQuery(group.page(libraryId, "ASC", 0)).data?.items ?? []

export const useAllAuthors = (libraryId: UUID) => useQuery(queries.authors.all(libraryId))
export const useAllSeries = (libraryId: UUID) => useQuery(queries.series.all(libraryId))
export const useAllGenres = (libraryId: UUID) => useQuery(queries.genres.all(libraryId))

export const useBooksPreview = (libraryId: UUID) => useResourcePreview(queries.books, libraryId)
export const useSeriesPreview = (libraryId: UUID) => useResourcePreview(queries.series, libraryId)
export const useAuthorsPreview = (libraryId: UUID) => useResourcePreview(queries.authors, libraryId)

const useResourceUpdate = <T extends Identifiable, D extends T, U>(
  group: EntityQueries<T, D>,
  updateFn: UpdateFn<U, T>
) => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: `save the ${group.singular}` },
    mutationFn: ({ libraryId, id, data }: { libraryId: UUID; id: UUID; data: U }) => updateFn({ libraryId, id }, data),
    onSuccess: (result, { libraryId, id }) => {
      patchEntity(queryClient, group, libraryId, id, () => result)
      return invalidateLibraryContent(queryClient, libraryId)
    },
  })
}

const useResourceAutoMatch = <T extends Identifiable, D extends T>(
  group: EntityQueries<T, D>,
  autoMatchFn: AutoMatchFn<T>
) => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: `auto match the ${group.singular}` },
    mutationFn: ({ libraryId, id }: { libraryId: UUID; id: UUID }) => autoMatchFn({ libraryId, id }),
    onSuccess: (result, { libraryId, id }) => {
      patchEntity(queryClient, group, libraryId, id, () => result)
      return invalidateLibraryContent(queryClient, libraryId)
    },
  })
}

const useResourceCreate = <T extends Identifiable, D extends T, C>(
  group: EntityQueries<T, D>,
  createFn: CreateFn<C, D>
) => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: `create the ${group.singular}` },
    mutationFn: ({ libraryId, data }: { libraryId: UUID; data: C }) => createFn({ libraryId }, data),
    onSuccess: (result, { libraryId }) => {
      queryClient.setQueryData(group.detail(libraryId, result.id).queryKey, result)
      queryClient.setQueryData(group.all(libraryId).queryKey, previous => previous && [...previous, result])
      return invalidateLibraryContent(queryClient, libraryId)
    },
  })
}

const useBookPlayState = <V extends { libraryId: UUID; id: UUID }>(
  action: string,
  mutationFn: (variables: V) => Promise<unknown>,
  merge: (previous: Book, variables: V) => Partial<Book>
) => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action },
    mutationFn,
    onSuccess: (_result, variables) => {
      patchBook(queryClient, variables.libraryId, variables.id, previous => merge(previous, variables))
      return invalidatePlayState(queryClient, variables.libraryId)
    },
  })
}

export const useSetBookFinished = () =>
  useBookPlayState(
    "update the play state",
    ({ libraryId, id, finished }: { libraryId: UUID; id: UUID; finished: boolean }) => {
      // Playback would keep writing the current position and the server would clear the finish
      // again, so the book has to leave the player before it is marked.
      if (finished && usePlayback.getState().book?.id === id) stopWithoutSync()
      return Api.setBookFinished({ libraryId, id }, { finished })
    },
    (previous, { finished }) => ({
      status: finished ? "FINISHED" : "UNPLAYED",
      positionMs: finished ? previous.durationMs : 0,
    })
  )

export const useResetBookProgress = () =>
  useBookPlayState(
    "reset the progress",
    ({ libraryId, id }: { libraryId: UUID; id: UUID }) => Api.setBookProgress({ libraryId, id }, { positionMs: 0 }),
    () => ({ status: "UNPLAYED", positionMs: 0 })
  )

// The book playing right now is pinned to the front rather than waited for: the server only
// lists a book once it has stored progress for it, so any refetch during the first moments of
// playback would otherwise drop it back out of the row.
export const useContinueListening = (): Book[] => {
  const queryClient = useQueryClient()
  const current = usePlayback(state => state.book)
  const { data } = useQuery(queries.continueListening)

  return useMemo(() => {
    const list = data ?? []
    if (!current) return list

    const playing =
      list.find(book => book.id === current.id) ??
      queryClient.getQueryData(queries.books.detail(current.libraryId, current.id).queryKey)
    if (!playing) return list

    return [playing, ...list.filter(book => book.id !== current.id)]
  }, [data, current, queryClient])
}

export const useBooks = (libraryId: UUID, order: Order = "ASC") => usePagedList(queries.books, libraryId, order)
export const useBook = (libraryId: UUID, id: UUID) => {
  const queryClient = useQueryClient()
  const { queryKey, queryFn, meta } = queries.books.detail(libraryId, id)
  return useQuery<Book | BookDetailed, Error, Book | BookDetailed, typeof queryKey>({
    queryKey,
    queryFn,
    meta,
    placeholderData: () => cachedListItem(queryClient, queries.books, libraryId, id),
  })
}
export const useUpdateBook = () => useResourceUpdate<Book, BookDetailed, BookUpdate>(queries.books, Api.updateBook)
export const useAutoMatchBook = () => useResourceAutoMatch(queries.books, Api.autoMatchBook)

export const useSeriesList = (libraryId: UUID, order: Order = "ASC") => usePagedList(queries.series, libraryId, order)
export const useSeries = (libraryId: UUID, id: UUID) => {
  const queryClient = useQueryClient()
  const { queryKey, queryFn, meta } = queries.series.detail(libraryId, id)
  return useQuery<Series | SeriesDetailed, Error, Series | SeriesDetailed, typeof queryKey>({
    queryKey,
    queryFn,
    meta,
    placeholderData: () => cachedListItem(queryClient, queries.series, libraryId, id),
  })
}
export const useUpdateSeries = () =>
  useResourceUpdate<Series, SeriesDetailed, SeriesUpdate>(queries.series, Api.updateSeries)
export const useAutoMatchSeries = () => useResourceAutoMatch(queries.series, Api.autoMatchSeries)
export const useCreateSeries = () =>
  useResourceCreate<Series, SeriesDetailed, SeriesCreate>(queries.series, Api.createSeries)

export const useAuthors = (libraryId: UUID, order: Order = "ASC") => usePagedList(queries.authors, libraryId, order)
export const useAuthor = (libraryId: UUID, id: UUID) => {
  const queryClient = useQueryClient()
  const { queryKey, queryFn, meta } = queries.authors.detail(libraryId, id)
  return useQuery<Author | AuthorDetailed, Error, Author | AuthorDetailed, typeof queryKey>({
    queryKey,
    queryFn,
    meta,
    placeholderData: () => cachedListItem(queryClient, queries.authors, libraryId, id),
  })
}
export const useUpdateAuthor = () =>
  useResourceUpdate<Author, AuthorDetailed, AuthorUpdate>(queries.authors, Api.updateAuthor)
export const useAutoMatchAuthor = () => useResourceAutoMatch(queries.authors, Api.autoMatchAuthor)
export const useCreateAuthor = () =>
  useResourceCreate<Author, AuthorDetailed, AuthorCreate>(queries.authors, Api.createAuthor)

export const useNameList = (resource: NameResource, libraryId: UUID, order: Order) =>
  usePagedList(queries[resource], libraryId, order)
export const useNarrator = (libraryId: UUID, name: string) => useQuery(queries.narrators.detail(libraryId, name))
export const useGenre = (libraryId: UUID, name: string) => useQuery(queries.genres.detail(libraryId, name))

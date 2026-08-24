import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ApiResponse,
  Api,
  Author,
  AuthorCreate,
  AuthorDetailed,
  AuthorUpdate,
  Book,
  BookDetailed,
  BookUpdate,
  Order,
  PaginatedResponse,
  Series,
  SeriesCreate,
  SeriesDetailed,
  SeriesUpdate,
  UUID,
  unwrap,
} from "@thoth/client"
import { invalidateLibraryContent } from "./invalidate"
import { LibraryResource, Resource, queryKeys } from "./keys"
import { ListFn, usePagedList } from "./paged-list"

export const PAGE_SIZE = 30

type Identifiable = { id: UUID }
type UpdateFn<U, R> = (params: { libraryId: UUID; id: UUID }, body: U) => Promise<ApiResponse<R>>
type AutoMatchFn<R> = (params: { libraryId: UUID; id: UUID }) => Promise<ApiResponse<R>>
type CreateFn<C, R> = (params: { libraryId: UUID }, body: C) => Promise<ApiResponse<R>>

// Shares page zero with the full list, so opening a library warms the list the reader lands on next.
const useResourcePreview = <T>(resource: Resource, listFn: ListFn<T>, libraryId: UUID) => {
  const query = useQuery({
    queryKey: queryKeys.libraryListPage(resource, libraryId, "ASC", 0),
    queryFn: () => unwrap(listFn({ libraryId, limit: PAGE_SIZE, offset: 0, order: "ASC" })),
    meta: { action: `load ${resource}` },
  })
  return query.data?.items ?? []
}

const listAllPages = async <T>(listFn: ListFn<T>, libraryId: UUID): Promise<T[]> => {
  const pageSize = 500
  const first = await unwrap(listFn({ libraryId, limit: pageSize, offset: 0, order: "ASC" }))
  if (first.items.length === 0 || first.items.length >= first.total) return first.items

  const offsets: number[] = []
  for (let offset = first.items.length; offset < first.total; offset += pageSize) offsets.push(offset)
  const rest = await Promise.all(
    offsets.map(offset => unwrap(listFn({ libraryId, limit: pageSize, offset, order: "ASC" })))
  )
  return [first, ...rest].flatMap(page => page.items)
}

const useAllOfResource = <T>(resource: LibraryResource, listFn: ListFn<T>, libraryId: UUID) =>
  useQuery({
    queryKey: queryKeys.resourceListAll(resource, libraryId),
    queryFn: () => listAllPages(listFn, libraryId),
    meta: { action: `load ${resource}` },
  })

export const useAllAuthors = (libraryId: UUID) => useAllOfResource("authors", Api.listAuthors, libraryId)
export const useAllSeries = (libraryId: UUID) => useAllOfResource("series", Api.listSeries, libraryId)
export const useAllGenres = (libraryId: UUID) => useAllOfResource("genres", Api.listGenres, libraryId)

export const useBooksPreview = (libraryId: UUID) => useResourcePreview("books", Api.listBooks, libraryId)
export const useSeriesPreview = (libraryId: UUID) => useResourcePreview("series", Api.listSeries, libraryId)
export const useAuthorsPreview = (libraryId: UUID) => useResourcePreview("authors", Api.listAuthors, libraryId)

const findCachedListItem = <T extends Identifiable>(
  queryClient: QueryClient,
  resource: Resource,
  libraryId: UUID,
  id: UUID
): T | undefined => {
  const pages = queryClient.getQueriesData<PaginatedResponse<T>>({
    queryKey: queryKeys.resourceLists(resource, libraryId),
  })
  for (const [, page] of pages) {
    const hit = page?.items.find(item => item.id === id)
    if (hit) return hit
  }
  return undefined
}

const useResourceUpdate = <U, R>(resource: Resource, singular: string, updateFn: UpdateFn<U, R>) => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: `save the ${singular}` },
    mutationFn: ({ libraryId, id, data }: { libraryId: UUID; id: UUID; data: U }) =>
      unwrap(updateFn({ libraryId, id }, data)),
    onSuccess: (result, { libraryId, id }) => {
      queryClient.setQueryData(queryKeys.resourceDetail(resource, libraryId, id), (previous: unknown) =>
        previous ? { ...previous, ...result } : result
      )
      return invalidateLibraryContent(queryClient, libraryId)
    },
  })
}

const useResourceAutoMatch = <R>(resource: Resource, singular: string, autoMatchFn: AutoMatchFn<R>) => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: `auto match the ${singular}` },
    mutationFn: ({ libraryId, id }: { libraryId: UUID; id: UUID }) => unwrap(autoMatchFn({ libraryId, id })),
    onSuccess: (result, { libraryId, id }) => {
      queryClient.setQueryData(queryKeys.resourceDetail(resource, libraryId, id), (previous: unknown) =>
        previous ? { ...previous, ...result } : result
      )
      return invalidateLibraryContent(queryClient, libraryId)
    },
  })
}

const useResourceCreate = <C, R extends Identifiable>(
  resource: Resource,
  singular: string,
  createFn: CreateFn<C, R>
) => {
  const queryClient = useQueryClient()
  return useMutation({
    meta: { action: `create the ${singular}` },
    mutationFn: ({ libraryId, data }: { libraryId: UUID; data: C }) => unwrap(createFn({ libraryId }, data)),
    onSuccess: (result, { libraryId }) => {
      queryClient.setQueryData(queryKeys.resourceDetail(resource, libraryId, result.id), result)
      queryClient.setQueryData(queryKeys.resourceListAll(resource, libraryId), (previous: R[] | undefined) =>
        previous ? [...previous, result] : previous
      )
      return invalidateLibraryContent(queryClient, libraryId)
    },
  })
}

export const useBooks = (libraryId: UUID, order: Order = "ASC") =>
  usePagedList({ resource: "books", listFn: Api.listBooks, libraryId, order, pageSize: PAGE_SIZE })

export const bookDetailQuery = (libraryId: UUID, id: UUID) => ({
  queryKey: queryKeys.resourceDetail("books", libraryId, id),
  queryFn: () => unwrap(Api.getBook({ libraryId, id })),
  meta: { action: "load the book" },
})

export const useBook = (libraryId: UUID, id: UUID) => {
  const queryClient = useQueryClient()
  return useQuery<Book | BookDetailed>({
    ...bookDetailQuery(libraryId, id),
    placeholderData: () => findCachedListItem<Book>(queryClient, "books", libraryId, id),
  })
}

export const useUpdateBook = () => useResourceUpdate<BookUpdate, Book>("books", "book", Api.updateBook)

export const useAutoMatchBook = () => useResourceAutoMatch<Book>("books", "book", Api.autoMatchBook)

export const useSeriesList = (libraryId: UUID, order: Order = "ASC") =>
  usePagedList({ resource: "series", listFn: Api.listSeries, libraryId, order, pageSize: PAGE_SIZE })

export const useSeries = (libraryId: UUID, id: UUID) => {
  const queryClient = useQueryClient()
  return useQuery<Series | SeriesDetailed>({
    queryKey: queryKeys.resourceDetail("series", libraryId, id),
    queryFn: () => unwrap(Api.getSeries({ libraryId, id })),
    meta: { action: "load the series" },
    placeholderData: () => findCachedListItem<Series>(queryClient, "series", libraryId, id),
  })
}

export const useUpdateSeries = () => useResourceUpdate<SeriesUpdate, Series>("series", "series", Api.updateSeries)

export const useAutoMatchSeries = () => useResourceAutoMatch<Series>("series", "series", Api.autoMatchSeries)

export const useCreateSeries = () =>
  useResourceCreate<SeriesCreate, SeriesDetailed>("series", "series", Api.createSeries)

export const useAuthors = (libraryId: UUID, order: Order = "ASC") =>
  usePagedList({ resource: "authors", listFn: Api.listAuthors, libraryId, order, pageSize: PAGE_SIZE })

export const useAuthor = (libraryId: UUID, id: UUID) => {
  const queryClient = useQueryClient()
  return useQuery<Author | AuthorDetailed>({
    queryKey: queryKeys.resourceDetail("authors", libraryId, id),
    queryFn: () => unwrap(Api.getAuthor({ libraryId, id })),
    meta: { action: "load the author" },
    placeholderData: () => findCachedListItem<Author>(queryClient, "authors", libraryId, id),
  })
}

export const useUpdateAuthor = () => useResourceUpdate<AuthorUpdate, Author>("authors", "author", Api.updateAuthor)

export const useAutoMatchAuthor = () => useResourceAutoMatch<Author>("authors", "author", Api.autoMatchAuthor)

export const useCreateAuthor = () =>
  useResourceCreate<AuthorCreate, AuthorDetailed>("authors", "author", Api.createAuthor)

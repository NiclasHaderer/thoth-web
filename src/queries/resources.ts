import {
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useMemo } from "react"
import {
  ApiResponse,
  Api,
  Author,
  AuthorDetailed,
  AuthorUpdate,
  Book,
  BookDetailed,
  BookUpdate,
  Order,
  PaginatedResponse,
  Series,
  SeriesDetailed,
  SeriesUpdate,
  UUID,
  unwrap,
} from "@thoth/client"
import { invalidateLibraryContent } from "./invalidate"
import { Resource, queryKeys } from "./keys"

export const PAGE_SIZE = 30

type Identifiable = { id: UUID }
type ListFn<T> = (params: {
  libraryId: UUID
  limit?: number
  offset?: number
  order?: Order
}) => Promise<ApiResponse<PaginatedResponse<T>>>
type UpdateFn<U, R> = (params: { libraryId: UUID; id: UUID }, body: U) => Promise<ApiResponse<R>>

const useResourceList = <T>(resource: Resource, listFn: ListFn<T>, libraryId: UUID, order: Order) => {
  const query = useInfiniteQuery({
    queryKey: queryKeys.resourceList(resource, libraryId, order),
    queryFn: ({ pageParam }) => unwrap(listFn({ libraryId, limit: PAGE_SIZE, offset: pageParam, order })),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const next = lastPage.offset + lastPage.items.length
      return next < lastPage.total ? next : undefined
    },
  })

  const items = useMemo(() => query.data?.pages.flatMap(page => page.items) ?? [], [query.data])

  return {
    items,
    total: query.data?.pages[0]?.total ?? 0,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
  }
}

const findCachedListItem = <T extends Identifiable>(
  queryClient: QueryClient,
  resource: Resource,
  libraryId: UUID,
  id: UUID
): T | undefined => {
  const lists = queryClient.getQueriesData<InfiniteData<PaginatedResponse<T>>>({
    queryKey: queryKeys.resourceLists(resource, libraryId),
  })
  for (const [, data] of lists) {
    const hit = data?.pages.flatMap(page => page.items).find(item => item.id === id)
    if (hit) return hit
  }
  return undefined
}

export const cachedResourceTotal = (
  queryClient: QueryClient,
  resource: Resource,
  libraryId: UUID
): number | undefined => {
  const lists = queryClient.getQueriesData<InfiniteData<PaginatedResponse<unknown>>>({
    queryKey: queryKeys.resourceLists(resource, libraryId),
  })
  return lists.find(([, data]) => data !== undefined)?.[1]?.pages[0]?.total
}

const useResourceUpdate = <U, R>(resource: Resource, updateFn: UpdateFn<U, R>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ libraryId, id, data }: { libraryId: UUID; id: UUID; data: U }) =>
      unwrap(updateFn({ libraryId, id }, data)),
    onSuccess: (result, { libraryId, id }) => {
      // Show the patched fields immediately; the invalidation below refetches
      // the authoritative detail (the PATCH response omits tracks/books).
      queryClient.setQueryData(queryKeys.resourceDetail(resource, libraryId, id), (previous: unknown) =>
        previous ? { ...previous, ...result } : result
      )
      return invalidateLibraryContent(queryClient, libraryId)
    },
  })
}

export const useBooks = (libraryId: UUID, order: Order = "ASC") =>
  useResourceList("books", Api.listBooks, libraryId, order)

export const bookDetailQuery = (libraryId: UUID, id: UUID) => ({
  queryKey: queryKeys.resourceDetail("books", libraryId, id),
  queryFn: () => unwrap(Api.getBook({ libraryId, id })),
})

export const useBook = (libraryId: UUID, id: UUID) => {
  const queryClient = useQueryClient()
  return useQuery<Book | BookDetailed>({
    ...bookDetailQuery(libraryId, id),
    placeholderData: () => findCachedListItem<Book>(queryClient, "books", libraryId, id),
  })
}

export const useUpdateBook = () => useResourceUpdate<BookUpdate, Book>("books", Api.updateBook)

export const useSeriesList = (libraryId: UUID, order: Order = "ASC") =>
  useResourceList("series", Api.listSeries, libraryId, order)

export const useSeries = (libraryId: UUID, id: UUID) => {
  const queryClient = useQueryClient()
  return useQuery<Series | SeriesDetailed>({
    queryKey: queryKeys.resourceDetail("series", libraryId, id),
    queryFn: () => unwrap(Api.getSeries({ libraryId, id })),
    placeholderData: () => findCachedListItem<Series>(queryClient, "series", libraryId, id),
  })
}

export const useUpdateSeries = () => useResourceUpdate<SeriesUpdate, Series>("series", Api.updateSeries)

export const useAuthors = (libraryId: UUID, order: Order = "ASC") =>
  useResourceList("authors", Api.listAuthors, libraryId, order)

export const useAuthor = (libraryId: UUID, id: UUID) => {
  const queryClient = useQueryClient()
  return useQuery<Author | AuthorDetailed>({
    queryKey: queryKeys.resourceDetail("authors", libraryId, id),
    queryFn: () => unwrap(Api.getAuthor({ libraryId, id })),
    placeholderData: () => findCachedListItem<Author>(queryClient, "authors", libraryId, id),
  })
}

export const useUpdateAuthor = () => useResourceUpdate<AuthorUpdate, Author>("authors", Api.updateAuthor)

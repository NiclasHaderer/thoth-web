import { useInfiniteQuery } from "@tanstack/react-query"
import { ApiResponse, Order, PaginatedResponse, UUID, unwrap } from "@thoth/client"
import { NameResource, queryKeys } from "./keys"

export const PAGE_SIZE = 50

export type NameListResource = NameResource
type NamedCount = { name: string; bookCount: number }
export type NameListCall = (params: {
  limit?: number
  offset?: number
  order?: Order
  libraryId: UUID
}) => Promise<ApiResponse<PaginatedResponse<NamedCount>>>

export const useNameList = (resource: NameListResource, list: NameListCall, libraryId: UUID, order: Order) =>
  useInfiniteQuery({
    queryKey: queryKeys.nameList(resource, libraryId, order),
    queryFn: ({ pageParam }) => unwrap(list({ libraryId, limit: PAGE_SIZE, offset: pageParam, order })),
    meta: { action: `load ${resource}` },
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const next = lastPage.offset + lastPage.items.length
      return next < lastPage.total ? next : undefined
    },
  })

import { useQueries } from "@tanstack/react-query"
import { useState } from "react"
import { ListRange } from "react-virtuoso"
import { ApiResponse, Order, PaginatedResponse, UUID, unwrap } from "@thoth/client"
import { LibraryResource, queryKeys } from "./keys"

export type ListFn<T> = (params: {
  libraryId: UUID
  limit?: number
  offset?: number
  order?: Order
}) => Promise<ApiResponse<PaginatedResponse<T>>>

interface PagedListOptions<T> {
  resource: LibraryResource
  listFn: ListFn<T>
  libraryId: UUID
  order: Order
  pageSize: number
}

export const usePagedList = <T>({ resource, listFn, libraryId, order, pageSize }: PagedListOptions<T>) => {
  const pageOf = (index: number) => Math.floor(index / pageSize) * pageSize

  const listKey = `${resource}:${libraryId}:${order}`

  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 })

  // Page zero stays loaded for as long as the list is open.
  const offsets = new Set([0])
  for (let offset = pageOf(range.startIndex); offset <= pageOf(range.endIndex); offset += pageSize) offsets.add(offset)
  const wanted = [...offsets].sort((a, b) => a - b)

  const results = useQueries({
    queries: wanted.map(offset => ({
      queryKey: queryKeys.libraryListPage(resource, libraryId, order, offset),
      queryFn: () => unwrap(listFn({ libraryId, limit: pageSize, offset, order })),
      meta: { action: `load ${resource}` },
    })),
  })

  const pages = new Map<number, T[]>()
  results.forEach((result, index) => {
    if (result.data) pages.set(wanted[index], result.data.items)
  })

  return {
    listKey,
    total: results.find(result => result.data)?.data?.total ?? 0,
    loading: results.some(result => result.isPending),
    itemAt: (index: number) => pages.get(pageOf(index))?.[index % pageSize],
    onRangeChange: setRange,
  }
}

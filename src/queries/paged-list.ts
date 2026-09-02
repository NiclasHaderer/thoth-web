import { useQueries } from "@tanstack/react-query"
import { useState } from "react"
import { ListRange } from "react-virtuoso"
import { Order, UUID } from "@thoth/client"
import { PagedQueries } from "./queries"

export const usePagedList = <T>(group: PagedQueries<T>, libraryId: UUID, order: Order) => {
  const { pageSize } = group
  const pageOf = (index: number) => Math.floor(index / pageSize) * pageSize

  const listKey = `${group.resource}:${libraryId}:${order}`

  const [range, setRange] = useState<ListRange>({ startIndex: 0, endIndex: 0 })

  // Page zero stays loaded for as long as the list is open.
  const offsets = new Set([0])
  for (let offset = pageOf(range.startIndex); offset <= pageOf(range.endIndex); offset += pageSize) offsets.add(offset)
  const wanted = [...offsets].sort((a, b) => a - b)

  const results = useQueries({ queries: wanted.map(offset => group.page(libraryId, order, offset)) })

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

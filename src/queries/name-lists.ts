import { Order, UUID } from "@thoth/client"
import { NameResource } from "./keys"
import { ListFn, usePagedList } from "./paged-list"

export const PAGE_SIZE = 50

export type NameListResource = NameResource
export type NamedCount = { name: string; bookCount: number }
export type NameListCall = ListFn<NamedCount>

export const useNameList = (resource: NameListResource, listFn: NameListCall, libraryId: UUID, order: Order) =>
  usePagedList({ resource, listFn, libraryId, order, pageSize: PAGE_SIZE })

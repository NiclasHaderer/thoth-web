import { Order, UUID } from "@thoth/client"

export type Resource = "books" | "series" | "authors"
export type NameResource = "narrators" | "genres"
export type LibraryResource = Resource | NameResource

const libraryScope = (libraryId: UUID) => ["library", libraryId] as const

export const queryKeys = {
  currentUser: ["current-user"] as const,
  users: ["users"] as const,

  libraries: ["libraries"] as const,

  metadataAgents: ["metadata-agents"] as const,
  fileScanners: ["file-scanners"] as const,
  folders: (path: string) => ["folders", path] as const,

  serverLicenses: ["licenses", "server"] as const,
  webLicenses: ["licenses", "web"] as const,

  librarySearches: ["library-search"] as const,
  librarySearch: (query: string) => ["library-search", query] as const,

  metadataSearch: (resource: Resource, libraryId: UUID, params: object) =>
    ["metadata-search", resource, libraryId, params] as const,

  library: libraryScope,

  resourceLists: (resource: LibraryResource, libraryId: UUID) =>
    [...libraryScope(libraryId), resource, "list"] as const,
  resourceListAll: (resource: LibraryResource, libraryId: UUID) =>
    [...libraryScope(libraryId), resource, "all"] as const,
  libraryListPage: (resource: LibraryResource, libraryId: UUID, order: Order, offset: number) =>
    [...libraryScope(libraryId), resource, "list", { order }, offset] as const,
  resourceDetail: (resource: Resource, libraryId: UUID, id: UUID) =>
    [...libraryScope(libraryId), resource, "detail", id] as const,

  nameDetail: (resource: NameResource, libraryId: UUID, name: string) =>
    [...libraryScope(libraryId), resource, "detail", name] as const,
}

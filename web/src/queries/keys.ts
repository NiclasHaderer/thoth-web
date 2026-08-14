import { Order, UUID } from "@thoth/client"

export type Resource = "books" | "series" | "authors"
export type NameResource = "narrators" | "genres"

// Everything that belongs to one library hangs off ["library", libraryId] so a
// content change can invalidate the whole subtree in one call.
const libraryScope = (libraryId: UUID) => ["library", libraryId] as const

export const queryKeys = {
  currentUser: ["current-user"] as const,
  users: ["users"] as const,

  libraries: ["libraries"] as const,

  metadataAgents: (language: string) => ["metadata-agents", language] as const,
  fileScanners: ["file-scanners"] as const,
  folders: (path: string) => ["folders", path] as const,

  serverLicenses: ["licenses", "server"] as const,
  webLicenses: ["licenses", "web"] as const,

  // Spans every library, so it is stale after any content change.
  librarySearches: ["library-search"] as const,
  librarySearch: (query: string) => ["library-search", query] as const,

  // Provider lookups, independent of our own content.
  metadataSearch: (resource: Resource, libraryId: UUID, params: object) =>
    ["metadata-search", resource, libraryId, params] as const,

  library: libraryScope,

  resourceLists: (resource: Resource, libraryId: UUID) => [...libraryScope(libraryId), resource, "list"] as const,
  resourceList: (resource: Resource, libraryId: UUID, order?: Order) =>
    [...libraryScope(libraryId), resource, "list", { order }] as const,
  resourceDetail: (resource: Resource, libraryId: UUID, id: UUID) =>
    [...libraryScope(libraryId), resource, "detail", id] as const,

  nameList: (resource: NameResource, libraryId: UUID, order: Order) =>
    [...libraryScope(libraryId), resource, "list", { order }] as const,
  nameDetail: (resource: NameResource, libraryId: UUID, name: string) =>
    [...libraryScope(libraryId), resource, "detail", name] as const,
}

import { useQuery } from "@tanstack/react-query"
import { UUID } from "@thoth/client"
import { queries } from "./queries"

type Search = { q: string; authorName?: string }

export const useAuthorMetadataSearch = (libraryId: UUID, params: { q: string } | null) =>
  useQuery({ ...queries.metadataSearch.authors(libraryId, params ?? { q: "" }), enabled: params !== null })

export const useBookMetadataSearch = (libraryId: UUID, params: Search | null) =>
  useQuery({ ...queries.metadataSearch.books(libraryId, params ?? { q: "" }), enabled: params !== null })

export const useSeriesMetadataSearch = (libraryId: UUID, params: Search | null) =>
  useQuery({ ...queries.metadataSearch.series(libraryId, params ?? { q: "" }), enabled: params !== null })

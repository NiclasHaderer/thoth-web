import { useLocation } from "wouter"
import { UUID } from "@dewey/client"
import { useLibraries } from "@dewey/queries/library-queries"
import { useLastLibrary } from "@dewey/state/last-library"

const LIBRARY_PATH = /^\/libraries\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/

export const useCurrentLibraryId = (): UUID | undefined => {
  const [pathname] = useLocation()
  return LIBRARY_PATH.exec(pathname)?.[1] as UUID | undefined
}

export const useActiveLibraryId = (): UUID | undefined => {
  const currentLibraryId = useCurrentLibraryId()
  const lastLibraryId = useLastLibrary(state => state.lastLibraryId)
  const libraries = useLibraries().data
  if (currentLibraryId) return currentLibraryId
  if (!libraries) return lastLibraryId
  return libraries.find(library => library.id === lastLibraryId)?.id ?? libraries[0]?.id
}

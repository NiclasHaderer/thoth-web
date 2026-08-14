import { useLocation } from "wouter"
import { UUID } from "@thoth/client"

const LIBRARY_PATH = /^\/libraries\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/

export const useCurrentLibraryId = (): UUID | undefined => {
  const [pathname] = useLocation()
  return LIBRARY_PATH.exec(pathname)?.[1] as UUID | undefined
}

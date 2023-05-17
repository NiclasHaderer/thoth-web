import { FC, ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { UUID } from "@thoth/client"
import { useAudiobookState } from "@thoth/state/audiobook.state"

const LIB_ID_EXTRACTION =
  /^\/libraries\/([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})($|\/)/

export const UrlWatcher: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname()

  useEffect(() => {
    const libraryId = LIB_ID_EXTRACTION.exec(pathname)?.[1] as UUID | undefined
    useAudiobookState.setState({ selectedLibraryId: libraryId })
  }, [pathname])

  return <>{children}</>
}

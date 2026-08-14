import { FC, PropsWithChildren, useEffect } from "react"
import { UUID } from "@thoth/client"
import { LeftResourceMenu } from "@thoth/components/menu/left-menu"
import { useAudiobookState } from "@thoth/state/audiobook.state"

interface LibraryResourceViewProps extends PropsWithChildren {
  libraryId: UUID
}

export const LibraryResourceView: FC<LibraryResourceViewProps> = ({ children, libraryId }) => {
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  const fetchBooks = useAudiobookState(s => s.fetchBooks)
  const fetchSeries = useAudiobookState(s => s.fetchSeries)
  const fetchAuthors = useAudiobookState(s => s.fetchAuthors)

  useEffect(() => {
    void fetchLibraries()
    void fetchBooks({ libraryId, offset: 0 })
    void fetchSeries({ libraryId, offset: 0 })
    void fetchAuthors({ libraryId, offset: 0 })
  }, [libraryId, fetchLibraries, fetchBooks, fetchSeries, fetchAuthors])

  return (
    <div className="flex min-h-0 grow overflow-hidden">
      <LeftResourceMenu libraryId={libraryId} className="hidden md:flex" />
      <main
        tabIndex={-1}
        className="min-w-0 grow overflow-x-hidden overflow-y-auto px-5 pb-[calc(var(--dock-height,3.5rem)+env(safe-area-inset-bottom))] md:mt-10 md:pb-0"
      >
        {children}
      </main>
    </div>
  )
}

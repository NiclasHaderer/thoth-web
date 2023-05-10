"use client"

import { LibraryPreview } from "@thoth/components/library/library-preview"
import React, { useEffect } from "react"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"

export default function LibraryIdOutlet() {
  const libraryId = useAudiobookState(AudiobookSelectors.selectedLibraryId)
  const library = useAudiobookState(AudiobookSelectors.selectedLibrary)
  const fetchLibrary = useAudiobookState(s => s.fetchLibrary)
  const fetchBooks = useAudiobookState(s => s.fetchBooks)
  const fetchSeries = useAudiobookState(s => s.fetchSeries)
  const fetchAuthors = useAudiobookState(s => s.fetchAuthors)

  useEffect(() => {
    if (!libraryId) return
    fetchLibrary(libraryId)
    fetchBooks({ libraryId: libraryId, offset: 0 })
    fetchSeries({ libraryId: libraryId, offset: 0 })
    fetchAuthors({ libraryId: libraryId, offset: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libraryId])

  return library && <LibraryPreview showHeading={false} library={library} />
}

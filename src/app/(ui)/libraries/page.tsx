"use client"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useRouter } from "next/navigation"
import React from "react"
import { LibraryPreview } from "@thoth/components/library/library-preview"

export default function LibrariesOutlet() {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  const fetchBooks = useAudiobookState(s => s.fetchBooks)
  const fetchSeries = useAudiobookState(s => s.fetchSeries)
  const fetchAuthors = useAudiobookState(s => s.fetchAuthors)
  const audiobookState = useAudiobookState()

  const router = useRouter()
  useOnMount(() => {
    fetchLibraries().then(libs => {
      if (!libs.success) return console.error(libs.error)
      if (libs.body.length === 0) router.push("/settings")
      libs.body.forEach(lib => {
        fetchBooks({ libraryId: lib.id, offset: 0 })
        fetchSeries({ libraryId: lib.id, offset: 0 })
        fetchAuthors({ libraryId: lib.id, offset: 0 })
      })
    })
  })
  return (
    <>
      <div className="mx-10">
        {libraries.map(library => (
          <LibraryPreview key={library.id} library={library} />
        ))}
      </div>
    </>
  )
}

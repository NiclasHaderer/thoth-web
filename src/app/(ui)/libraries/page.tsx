import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { LibraryPreview } from "@thoth/components/library/library-preview"
import { navigate } from "wouter/use-browser-location"

export const LibrariesOutlet = () => {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  const fetchBooks = useAudiobookState(s => s.fetchBooks)
  const fetchSeries = useAudiobookState(s => s.fetchSeries)
  const fetchAuthors = useAudiobookState(s => s.fetchAuthors)

  useOnMount(() => {
    void fetchLibraries().then(libs => {
      if (!libs.success) return console.error(libs.error)
      if (libs.body.length === 0) navigate("/settings")
      libs.body.forEach(lib => {
        void fetchBooks({ libraryId: lib.id, offset: 0 })
        void fetchSeries({ libraryId: lib.id, offset: 0 })
        void fetchAuthors({ libraryId: lib.id, offset: 0 })
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

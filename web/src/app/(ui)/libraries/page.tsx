import { useLocation } from "wouter"
import { LibraryPreview } from "@thoth/components/library/library-preview"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { useCurrentUserState } from "@thoth/state/current-user.state"

export const LibrariesOutlet = () => {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  const fetchBooks = useAudiobookState(s => s.fetchBooks)
  const fetchSeries = useAudiobookState(s => s.fetchSeries)
  const fetchAuthors = useAudiobookState(s => s.fetchAuthors)
  const fetchCurrentUser = useCurrentUserState(s => s.fetchCurrentUser)
  const [, navigate] = useLocation()

  useOnMount(() => {
    void (async () => {
      const [me, libs] = await Promise.all([fetchCurrentUser(), fetchLibraries()])
      if (!libs.success) return console.error(libs.error)
      if (libs.body.length === 0) {
        // Only admins can create libraries (in settings). Regular users stay here
        // and get the contact-your-admin message below.
        if (me?.permissions.isAdmin) navigate("/settings")
        return
      }
      libs.body.forEach(lib => {
        void fetchBooks({ libraryId: lib.id, offset: 0 })
        void fetchSeries({ libraryId: lib.id, offset: 0 })
        void fetchAuthors({ libraryId: lib.id, offset: 0 })
      })
    })()
  })

  if (libraries.length === 0) {
    return (
      <div className="text-muted-foreground mx-4 mt-16 text-center sm:mx-10">
        <p className="text-lg font-medium">No libraries available</p>
        <p className="mt-1 text-sm">Contact your administrator to get access to a library.</p>
      </div>
    )
  }

  return (
    <div className="mx-4 space-y-8 sm:mx-10">
      {libraries.map(library => (
        <LibraryPreview libraryCount={libraries.length} key={library.id} library={library} />
      ))}
    </div>
  )
}

import { useLocation } from "wouter"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { useCurrentUserState } from "@thoth/state/current-user.state"

export const LibrariesOutlet = () => {
  const libraries = useAudiobookState(AudiobookSelectors.libraries)
  const fetchLibraries = useAudiobookState(s => s.fetchLibraries)
  const fetchCurrentUser = useCurrentUserState(s => s.fetchCurrentUser)
  const [, navigate] = useLocation()

  useOnMount(() => {
    if (libraries.length > 0) {
      navigate(`/libraries/${libraries[0].id}`, { replace: true })
      return
    }
    void (async () => {
      const [me, libs] = await Promise.all([fetchCurrentUser(), fetchLibraries()])
      if (!libs.success) return console.error(libs.error)
      if (libs.body.length === 0) {
        // Only admins can create libraries (in settings). Regular users stay here
        // and get the contact-your-admin message below.
        if (me?.permissions.isAdmin) navigate("/settings")
        return
      }
      navigate(`/libraries/${libs.body[0].id}`, { replace: true })
    })()
  })

  if (libraries.length > 0) return null

  return (
    <div className="text-muted-foreground mx-4 mt-16 text-center sm:mx-10">
      <p className="text-lg font-medium">No libraries available</p>
      <p className="mt-1 text-sm">Contact your administrator to get access to a library.</p>
    </div>
  )
}

import { useEffect } from "react"
import { useLocation } from "wouter"
import { useActiveLibraryId } from "@thoth/hooks/use-current-library"
import { useCurrentUser } from "@thoth/queries/current-user-queries"
import { useLibraries } from "@thoth/queries/library-queries"

export const LibrariesOutlet = () => {
  const { data: libraries } = useLibraries()
  const libraryId = useActiveLibraryId()
  const { data: user } = useCurrentUser()
  const [, navigate] = useLocation()

  useEffect(() => {
    if (!libraries) return
    if (libraryId) {
      navigate(`/libraries/${libraryId}`, { replace: true })
      return
    }
    // Only admins can create libraries (in settings). Regular users stay here
    // and get the contact-your-admin message below.
    if (user?.permissions.isAdmin) navigate("/settings")
  }, [libraries, libraryId, user, navigate])

  if (!libraries || libraries.length > 0) return null

  return (
    <div className="text-muted-foreground mx-4 mt-16 text-center sm:mx-10">
      <p className="text-lg font-medium">No libraries available</p>
      <p className="mt-1 text-sm">Contact your administrator to get access to a library.</p>
    </div>
  )
}

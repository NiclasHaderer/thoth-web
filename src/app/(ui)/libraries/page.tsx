import { useEffect } from "react"
import { useLocation } from "wouter"
import { useCurrentUser } from "@thoth/queries/current-user"
import { useLibraries } from "@thoth/queries/libraries"

export const LibrariesOutlet = () => {
  const { data: libraries } = useLibraries()
  const { data: user } = useCurrentUser()
  const [, navigate] = useLocation()

  useEffect(() => {
    if (!libraries) return
    if (libraries.length > 0) {
      navigate(`/libraries/${libraries[0].id}`, { replace: true })
      return
    }
    // Only admins can create libraries (in settings). Regular users stay here
    // and get the contact-your-admin message below.
    if (user?.permissions.isAdmin) navigate("/settings")
  }, [libraries, user, navigate])

  if (!libraries || libraries.length > 0) return null

  return (
    <div className="text-muted-foreground mx-4 mt-16 text-center sm:mx-10">
      <p className="text-lg font-medium">No libraries available</p>
      <p className="mt-1 text-sm">Contact your administrator to get access to a library.</p>
    </div>
  )
}

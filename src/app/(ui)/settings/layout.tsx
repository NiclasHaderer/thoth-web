import { FC, ReactNode } from "react"
import { useLocation } from "wouter"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useCurrentUserState } from "@thoth/state/current-user.state"

export const SettingsLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const user = useCurrentUserState(s => s.user)
  const fetchCurrentUser = useCurrentUserState(s => s.fetchCurrentUser)
  const [, navigate] = useLocation()

  useOnMount(() => {
    void fetchCurrentUser().then(me => {
      if (me && !me.permissions.isAdmin) navigate("/libraries")
    })
  })

  // Only mount the (admin-only) settings once we know the user is an admin, so
  // non-admins never trigger the admin-only requests before being redirected.
  if (!user?.permissions.isAdmin) return null

  return <div className="mx-auto w-full p-2 sm:max-w-4/5 sm:p-0 lg:max-w-3/5 xl:max-w-1/2">{children}</div>
}

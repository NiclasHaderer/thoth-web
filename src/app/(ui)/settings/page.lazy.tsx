import { Redirect } from "wouter"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useCurrentUserState } from "@thoth/state/current-user.state"

export const SettingsOutlet = () => {
  const user = useCurrentUserState(s => s.user)
  const fetchCurrentUser = useCurrentUserState(s => s.fetchCurrentUser)
  useOnMount(() => void fetchCurrentUser())
  if (!user) return null
  return <Redirect to={user.permissions.isAdmin ? "/settings/libraries" : "/settings/account"} />
}

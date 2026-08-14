import { Redirect } from "wouter"
import { useCurrentUser } from "@thoth/queries/current-user"

export const SettingsOutlet = () => {
  const { data: user } = useCurrentUser()
  if (!user) return null
  return <Redirect to={user.permissions.isAdmin ? "/settings/libraries" : "/settings/account"} />
}

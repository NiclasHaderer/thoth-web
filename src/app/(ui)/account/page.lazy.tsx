import { useEffect } from "react"
import { User } from "@thoth/components/account/account"
import { useAuthState } from "@thoth/state/auth.state"
import { useCurrentUserState } from "@thoth/state/current-user.state"

export const AccountOutlet = () => {
  const user = useCurrentUserState(s => s.user)
  const fetchCurrentUser = useCurrentUserState(s => s.fetchCurrentUser)
  const jwt = useAuthState(s => s.accessTokenStr)
  useEffect(() => void fetchCurrentUser(true), [jwt, fetchCurrentUser])
  return user && <User user={user} />
}

import { useEffect } from "react"
import { User } from "@thoth/components/account/account"
import { useAuthState } from "@thoth/state/auth.state"
import { useCurrentUserState } from "@thoth/state/current-user.state"

export const SettingsAccountOutlet = () => {
  const user = useCurrentUserState(s => s.user)
  const fetchCurrentUser = useCurrentUserState(s => s.fetchCurrentUser)
  const jwt = useAuthState(s => s.accessTokenStr)
  useEffect(() => void fetchCurrentUser(true), [jwt, fetchCurrentUser])
  return (
    user && (
      <>
        <h2 className="mb-4 text-xl">Account</h2>
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          <User user={user} />
        </div>
      </>
    )
  )
}

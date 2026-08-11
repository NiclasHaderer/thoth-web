import { useEffect } from "react"
import { User } from "@thoth/components/account/account"
import { SettingsSection } from "@thoth/components/settings/settings-section"
import { useAuthState } from "@thoth/state/auth.state"
import { useCurrentUserState } from "@thoth/state/current-user.state"

export const SettingsAccountOutlet = () => {
  const user = useCurrentUserState(s => s.user)
  const fetchCurrentUser = useCurrentUserState(s => s.fetchCurrentUser)
  const jwt = useAuthState(s => s.accessTokenStr)
  useEffect(() => void fetchCurrentUser(true), [jwt, fetchCurrentUser])
  return (
    user && (
      <SettingsSection title="Account">
        <div className="flex flex-col gap-4">
          <User user={user} />
        </div>
      </SettingsSection>
    )
  )
}

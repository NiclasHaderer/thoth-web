import { useEffect } from "react"
import { User } from "@thoth/components/account/account"
import { SettingsSection } from "@thoth/components/settings/settings-section"
import { useCurrentUser } from "@thoth/queries/current-user"
import { useAuthState } from "@thoth/state/auth.state"

export const SettingsAccountOutlet = () => {
  const { data: user, refetch } = useCurrentUser()
  const jwt = useAuthState(s => s.accessTokenStr)
  useEffect(() => void refetch(), [jwt, refetch])
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

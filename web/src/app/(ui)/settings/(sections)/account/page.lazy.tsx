import { useEffect } from "react"
import { useSession } from "@dewey/client"
import { User } from "@dewey/components/account/account"
import { SettingsSection } from "@dewey/components/settings/settings-section"
import { useCurrentUser } from "@dewey/queries/current-user-queries"

export const SettingsAccountOutlet = () => {
  const { data: user, refetch } = useCurrentUser()
  const jwt = useSession(s => s.accessTokenStr)
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

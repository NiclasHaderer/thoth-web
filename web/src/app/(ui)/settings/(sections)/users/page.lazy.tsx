import { SettingsSection } from "@thoth/components/settings/settings-section"
import { UserManager } from "@thoth/components/user-manager"

export const SettingsUsersOutlet = () => {
  return (
    <SettingsSection title="Manage Users">
      <UserManager />
    </SettingsSection>
  )
}

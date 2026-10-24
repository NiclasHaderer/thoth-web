import { SettingsSection } from "@dewey/components/settings/settings-section"
import { UserManager } from "@dewey/components/user-manager"

export const SettingsUsersOutlet = () => {
  return (
    <SettingsSection title="Manage Users">
      <UserManager />
    </SettingsSection>
  )
}

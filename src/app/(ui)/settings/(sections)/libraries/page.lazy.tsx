import { LibraryManager } from "@thoth/components/library/library-manager"
import { SettingsSection } from "@thoth/components/settings/settings-section"

export const SettingsLibrariesOutlet = () => {
  return (
    <SettingsSection title="Manage Libraries">
      <LibraryManager />
    </SettingsSection>
  )
}

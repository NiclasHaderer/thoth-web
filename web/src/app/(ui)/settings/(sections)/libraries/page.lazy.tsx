import { LibraryManager } from "@dewey/components/library/library-manager"
import { SettingsSection } from "@dewey/components/settings/settings-section"

export const SettingsLibrariesOutlet = () => {
  return (
    <SettingsSection title="Manage Libraries">
      <LibraryManager />
    </SettingsSection>
  )
}

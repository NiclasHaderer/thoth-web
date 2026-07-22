import { LibraryManager } from "@thoth/components/library/library-manager"

export const SettingsLibrariesOutlet = () => {
  return (
    <>
      <h2 className="mb-4 text-xl">Manage Libraries</h2>
      <LibraryManager />
    </>
  )
}

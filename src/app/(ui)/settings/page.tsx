"use client"

import { UserManager } from "@thoth/components/user-manager"
import { LibraryManager } from "@thoth/components/library/library-manager"

export default function SettingsOutlet() {
  return (
    <>
      <h2 className="mb-2 mt-4 text-xl">Manage Libraries</h2>
      <LibraryManager />

      <h2 className="mb-2 text-xl">Manage Users</h2>
      <UserManager />
    </>
  )
}

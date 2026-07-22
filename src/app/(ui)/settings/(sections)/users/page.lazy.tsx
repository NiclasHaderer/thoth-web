import { UserManager } from "@thoth/components/user-manager"

export const SettingsUsersOutlet = () => {
  return (
    <>
      <h2 className="mb-4 text-xl">Manage Users</h2>
      <UserManager />
    </>
  )
}

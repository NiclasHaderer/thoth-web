import { useOnMount } from "@thoth/hooks/lifecycle"
import { logout } from "@thoth/state/user-data"

export const LogoutOutlet = () => {
  useOnMount(async () => {
    await logout()
    // Full reload to drop all in-memory state (current user, audiobook cache, ...).
    window.location.replace("/login")
  })

  return <></>
}

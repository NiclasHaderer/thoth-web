import { useOnMount } from "@thoth/hooks/lifecycle"
import { useAuthState } from "@thoth/state/auth.state"

export const LogoutOutlet = () => {
  const auth = useAuthState()
  useOnMount(async () => {
    await auth.logout()
    // Full reload to drop all in-memory state (current user, audiobook cache, ...).
    window.location.replace("/#/login")
    window.location.reload()
  })

  return <></>
}

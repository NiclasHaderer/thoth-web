import { useAuthState } from "@thoth/state/auth.state"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { navigate } from "wouter/use-browser-location"

export const LogoutOutlet = () => {
  const auth = useAuthState()
  useOnMount(async () => {
    await auth.logout()
    navigate("/login")
  })

  return <></>
}

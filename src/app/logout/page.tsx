import { useLocation } from "wouter"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useAuthState } from "@thoth/state/auth.state"

export const LogoutOutlet = () => {
  const auth = useAuthState()
  const [, navigate] = useLocation()
  useOnMount(async () => {
    await auth.logout()
    navigate("/login")
  })

  return <></>
}

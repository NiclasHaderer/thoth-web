import { LoginRegister } from "@thoth/components/login-register"
import { useOnMount } from "@thoth/hooks/lifecycle"
import { useAuthState } from "@thoth/state/auth.state"

export const LoginOutlet = () => {
  const logout = useAuthState(s => s.logout)
  useOnMount(() => logout())
  return <LoginRegister type="login" />
}

import { LoginRegister } from "@thoth/components/login-register"
import { useAuthState } from "@thoth/state/auth.state"
import { useOnMount } from "@thoth/hooks/lifecycle"

export const RegisterOutlet = () => {
  const logout = useAuthState(s => s.logout)
  useOnMount(() => logout())
  return <LoginRegister type="register" />
}

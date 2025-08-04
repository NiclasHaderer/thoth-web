import { FC } from "react"
import { LoginRegister } from "@thoth/components/login-register.tsx"
import { useOnMount } from "@thoth/hooks/lifecycle.ts"
import { useAuthState } from "@thoth/state/auth.state.ts"

export const LoginOutlet: FC<{ redirectPath: string }> = ({ redirectPath }) => {
  const logout = useAuthState(s => s.logout)
  useOnMount(() => logout())
  return <LoginRegister type="login" redirectPath={redirectPath} />
}

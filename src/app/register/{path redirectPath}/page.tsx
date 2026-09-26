import { FC } from "react"
import { LoginRegister } from "@thoth/components/login-register.tsx"
import { useOnMount } from "@thoth/hooks/lifecycle.ts"
import { logout } from "@thoth/state/logout.ts"

export const RegisterOutlet: FC<{ redirectPath?: string }> = ({ redirectPath }) => {
  useOnMount(() => logout())
  return <LoginRegister type="register" redirectPath={redirectPath} />
}

import { FC } from "react"
import { LoginRegister } from "@thoth/components/login-register.tsx"
import { useOnMount } from "@thoth/hooks/use-lifecycle.ts"
import { logout } from "@thoth/state/user-data.ts"

export const RegisterOutlet: FC<{ redirectPath?: string }> = ({ redirectPath }) => {
  useOnMount(() => logout())
  return <LoginRegister type="register" redirectPath={redirectPath} />
}

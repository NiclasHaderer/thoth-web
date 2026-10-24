import { FC } from "react"
import { LoginRegister } from "@dewey/components/login-register.tsx"
import { useOnMount } from "@dewey/hooks/use-lifecycle.ts"
import { logout } from "@dewey/state/user-data"

export const LoginOutlet: FC<{ redirectPath?: string }> = ({ redirectPath }) => {
  useOnMount(() => logout())
  return <LoginRegister type="login" redirectPath={redirectPath} />
}

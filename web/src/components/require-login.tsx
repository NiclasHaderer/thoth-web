import { FC, PropsWithChildren, useEffect } from "react"
import { useAuthState } from "@thoth/state/auth.state"
import { useRouter } from "next/navigation"
import { NoSsr } from "@thoth/components/no-ssr"

export const RequireLogin: FC<PropsWithChildren> = ({ children }) => {
  const isLoggedIn = useAuthState(s => s.loggedIn)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (isLoggedIn) return
    router.push("/login")
  })
  if (!isLoggedIn) {
    return <NoSsr></NoSsr>
  }
  return <NoSsr>{children}</NoSsr>
}

import { FC, PropsWithChildren, useEffect } from "react"
import { useAuthState } from "@thoth/state/auth.state"
import { useRouter } from "next/navigation"
import { NoSSR } from "@thoth/components/no-ssr"

export const RequireLogin: FC<PropsWithChildren> = ({ children }) => {
  const isLoggedIn = useAuthState(s => s.loggedIn)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (isLoggedIn) return

    const currentPath = location.href.split(location.host)[1]
    const afterLoginRedirect = new URLSearchParams({ origin: currentPath })
    const loginUrl = `/login?${afterLoginRedirect}`
    router.push(loginUrl)
  })
  return <NoSSR>{isLoggedIn ? children : null}</NoSSR>
}

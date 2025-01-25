import { FC, PropsWithChildren, useEffect } from "react"
import { useAuthState } from "@thoth/state/auth.state"
import { navigate } from "wouter/use-browser-location"

export const RequireLogin: FC<PropsWithChildren> = ({ children }) => {
  const isLoggedIn = useAuthState(s => s.loggedIn)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (isLoggedIn) return

    const currentPath = location.href.split(location.host)[1]
    const afterLoginRedirect = new URLSearchParams({ origin: currentPath })
    const loginUrl = `/login?${afterLoginRedirect}`
    navigate(loginUrl)
  })
  if (!isLoggedIn) return null
  return <>{children}</>
}

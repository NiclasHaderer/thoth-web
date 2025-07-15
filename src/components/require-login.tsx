import { FC, PropsWithChildren, useEffect } from "react"
import { useLocation } from "wouter"
import { useAuthState } from "@thoth/state/auth.state"

export const RequireLogin: FC<PropsWithChildren> = ({ children }) => {
  const isLoggedIn = useAuthState(s => s.loggedIn)
  const [currentLocation, navigate] = useLocation()

  useEffect(() => {
    if (isLoggedIn) return
    navigate(`/login/${currentLocation}`)
  }, [])
  if (!isLoggedIn) return null
  return <>{children}</>
}

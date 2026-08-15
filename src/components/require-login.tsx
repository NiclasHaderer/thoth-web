import { FC, PropsWithChildren, useEffect } from "react"
import { useLocation } from "wouter"
import { useAuthState } from "@thoth/state/auth.state"

export const RequireLogin: FC<PropsWithChildren> = ({ children }) => {
  const isLoggedIn = useAuthState(s => s.loggedIn)
  const [currentLocation, navigate] = useLocation()

  useEffect(() => {
    if (isLoggedIn) return
    navigate(`/login/${currentLocation}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- redirect once per session change, not per navigation
  }, [isLoggedIn])
  if (!isLoggedIn) return null
  return <>{children}</>
}

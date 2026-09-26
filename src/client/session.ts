import { FC, ReactNode, useEffect } from "react"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { decodeJWT, Jwt } from "@thoth/utils/jwt"
import { isNetworkError } from "./error"
import { ApiError, ApiResponse, ApiSuccess } from "./generated/client"
import { ThothLoginUser } from "./generated/models"
import { persistKey } from "./persist"
import { PublicApi } from "./public-api"
import { queryClient } from "./query-client"

export type Session =
  | { loggedIn: false; accessTokenStr: undefined; accessToken: undefined }
  | { loggedIn: true; accessTokenStr: string; accessToken: Jwt }

export type RefreshResult = "ok" | "failed" | "offline"

export const SESSION_EXPIRED: ApiError = { success: false, error: "Session expired", status: 401 }
export const OFFLINE: ApiError = { success: false, error: "You are offline" }
const NOT_LOGGED_IN: ApiError = { success: false, error: "Not logged in", status: 401 }

const SIGNED_OUT: Session = { loggedIn: false, accessTokenStr: undefined, accessToken: undefined }

export const useSession = create<Session>()(
  persist((): Session => SIGNED_OUT, {
    name: persistKey("session"),
    version: 1,
    storage: createJSONStorage(() => localStorage),
  })
)

const adopt = (accessToken: string): void => {
  useSession.setState({ loggedIn: true, accessTokenStr: accessToken, accessToken: decodeJWT(accessToken) }, true)
}

const login = async (userPw: ThothLoginUser): Promise<void> => {
  const { accessToken } = await PublicApi.loginUser(userPw)
  queryClient.clear()
  adopt(accessToken)
}

const register = async (userPw: ThothLoginUser): Promise<void> => {
  await PublicApi.registerUser(userPw)
  await login(userPw)
}

const end = async (): Promise<void> => {
  useSession.setState(SIGNED_OUT, true)
  await PublicApi.logoutUser().catch(() => undefined)
}

let refreshInFlight: Promise<RefreshResult> | undefined

const refresh = (): Promise<RefreshResult> => {
  refreshInFlight ??= PublicApi.refreshAccessToken()
    .then(({ accessToken }): RefreshResult => {
      adopt(accessToken)
      return "ok"
    })
    .catch((error: unknown): RefreshResult => (isNetworkError(error) ? "offline" : "failed"))
    .finally(() => (refreshInFlight = undefined))
  return refreshInFlight
}

const renew = async (): Promise<RefreshResult> => {
  const refreshed = await refresh()
  if (refreshed === "failed") await end()
  return refreshed
}

export const session = { login, register, end, renew }

const bearer = (): ApiSuccess<string> => ({ success: true, body: `Bearer ${useSession.getState().accessTokenStr}` })

export const renewedAuthorizationHeader = async (): Promise<ApiResponse<string>> => {
  const refreshed = await renew()
  if (refreshed === "offline") return OFFLINE
  if (refreshed === "failed") return SESSION_EXPIRED
  return bearer()
}

export const authorizationHeader = async (): Promise<ApiResponse<string>> => {
  const current = useSession.getState()
  if (!current.loggedIn) return NOT_LOGGED_IN
  if (dueForRenewal(current.accessToken)) return renewedAuthorizationHeader()
  return bearer()
}

const RENEW_LEEWAY_MS = 30_000
const RENEW_CHECK_MS = 15_000

const dueForRenewal = (token: Jwt): boolean => token.payload.exp * 1000 - RENEW_LEEWAY_MS <= Date.now()

const useRenewWhileLoggedIn = () => {
  const loggedIn = useSession(s => s.loggedIn)

  useEffect(() => {
    if (!loggedIn) return

    const renewIfDue = () => {
      const token = useSession.getState().accessToken
      if (token && dueForRenewal(token)) void renew()
    }

    renewIfDue()
    const timer = setInterval(renewIfDue, RENEW_CHECK_MS)
    return () => clearInterval(timer)
  }, [loggedIn])
}

export const SessionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  useRenewWhileLoggedIn()
  return children
}

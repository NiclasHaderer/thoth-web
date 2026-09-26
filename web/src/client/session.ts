import { useEffect } from "react"
import { useStore } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { createStore } from "zustand/vanilla"
import { decodeJWT, Jwt } from "@thoth/utils/jwt"
import { isNetworkError } from "./error"
import { ApiError, ApiResponse, ApiSuccess } from "./generated/client"
import { ThothLoginUser } from "./generated/models"
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

export const sessionStore = createStore<Session>()(
  persist((): Session => SIGNED_OUT, { name: "auth", storage: createJSONStorage(() => localStorage) })
)

export const useSession = <T>(selector: (session: Session) => T): T => useStore(sessionStore, selector)

export const adoptAccessToken = (accessToken: string): void => {
  sessionStore.setState({ loggedIn: true, accessTokenStr: accessToken, accessToken: decodeJWT(accessToken) }, true)
}

export const login = async (userPw: ThothLoginUser): Promise<void> => {
  const { accessToken } = await PublicApi.loginUser(userPw)
  queryClient.clear()
  adoptAccessToken(accessToken)
}

export const register = async (userPw: ThothLoginUser): Promise<void> => {
  await PublicApi.registerUser(userPw)
  await login(userPw)
}

export const endSession = async (): Promise<void> => {
  sessionStore.setState(SIGNED_OUT, true)
  await PublicApi.logoutUser().catch(() => undefined)
}

let refreshInFlight: Promise<RefreshResult> | undefined

const refresh = (): Promise<RefreshResult> => {
  refreshInFlight ??= PublicApi.refreshAccessToken()
    .then(({ accessToken }): RefreshResult => {
      adoptAccessToken(accessToken)
      return "ok"
    })
    .catch((error: unknown): RefreshResult => (isNetworkError(error) ? "offline" : "failed"))
    .finally(() => (refreshInFlight = undefined))
  return refreshInFlight
}

export const renewSession = async (): Promise<RefreshResult> => {
  const refreshed = await refresh()
  if (refreshed === "failed") await endSession()
  return refreshed
}

const bearer = (): ApiSuccess<string> => ({ success: true, body: `Bearer ${sessionStore.getState().accessTokenStr}` })

export const renewedAuthorizationHeader = async (): Promise<ApiResponse<string>> => {
  const refreshed = await renewSession()
  if (refreshed === "offline") return OFFLINE
  if (refreshed === "failed") return SESSION_EXPIRED
  return bearer()
}

export const authorizationHeader = async (): Promise<ApiResponse<string>> => {
  const session = sessionStore.getState()
  if (!session.loggedIn) return NOT_LOGGED_IN
  if (dueForRenewal(session.accessToken)) return renewedAuthorizationHeader()
  return bearer()
}

const RENEW_LEEWAY_MS = 30_000
const RENEW_CHECK_MS = 15_000

const dueForRenewal = (token: Jwt): boolean => token.payload.exp * 1000 - RENEW_LEEWAY_MS <= Date.now()

export const useSessionRefresh = () => {
  const loggedIn = useSession(s => s.loggedIn)

  useEffect(() => {
    if (!loggedIn) return

    const renewIfDue = () => {
      const token = sessionStore.getState().accessToken
      if (token && dueForRenewal(token)) void renewSession()
    }

    renewIfDue()
    const timer = setInterval(renewIfDue, RENEW_CHECK_MS)
    return () => clearInterval(timer)
  }, [loggedIn])
}

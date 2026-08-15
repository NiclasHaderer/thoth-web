import { useEffect } from "react"
import { toast } from "sonner"
import { create } from "zustand"
import { combine, persist } from "zustand/middleware"
import { Api, ThothLoginUser } from "@thoth/client"
import { queryClient } from "@thoth/client/query-client"
import { decodeJWT, Jwt } from "@thoth/utils/jwt"

export type AuthState =
  | {
      loggedIn: false
      accessTokenStr: undefined
      accessToken: undefined
    }
  | {
      loggedIn: true
      accessToken: Jwt
      accessTokenStr: string
    }

let refreshInFlight: Promise<boolean> | undefined

const INITIAL_USER_STATE: AuthState = {
  loggedIn: false,
  accessTokenStr: undefined,
  accessToken: undefined,
}

export const useAuthState = create(
  persist(
    combine(INITIAL_USER_STATE as AuthState, (set, _get, modify) => ({
      login: async (userPw: ThothLoginUser) => {
        const jwt = await Api.loginUser(userPw)
        if (!jwt.success) return jwt
        const { accessToken } = jwt.body
        const decodedAccessToken = decodeJWT(accessToken)
        queryClient.clear()
        set({
          loggedIn: true,
          accessTokenStr: accessToken,
          accessToken: decodedAccessToken,
        })
        return jwt
      },
      register: async (userPw: ThothLoginUser) => {
        const user = await Api.registerUser(userPw)
        if (!user.success) return user
        return await useAuthState.getState().login(userPw)
      },
      logout: async () => {
        modify.setState(INITIAL_USER_STATE)
        queryClient.clear()
        await Api.logoutUser()
      },
      refreshAccessToken: (): Promise<boolean> => {
        refreshInFlight ??= Api.refreshAccessToken()
          .then(newAccessToken => {
            if (!newAccessToken.success) {
              const message = "Your session expired. Please log in again."
              toast.error(message, { id: message })
              return false
            }
            set({
              loggedIn: true,
              accessTokenStr: newAccessToken.body.accessToken,
              accessToken: decodeJWT(newAccessToken.body.accessToken),
            })
            return true
          })
          .finally(() => (refreshInFlight = undefined))
        return refreshInFlight
      },
    })),
    {
      name: "auth",
    }
  )
)

const REFRESH_LEEWAY_MS = 30_000
const REFRESH_RETRY_MS = 15_000

export const useSessionRefresh = () => {
  const loggedIn = useAuthState(s => s.loggedIn)

  useEffect(() => {
    if (!loggedIn) return
    let timer: ReturnType<typeof setTimeout>

    const schedule = () => {
      const token = useAuthState.getState().accessToken
      if (!token) return
      timer = setTimeout(refresh, Math.max(0, token.payload.exp * 1000 - REFRESH_LEEWAY_MS - Date.now()))
    }

    const refresh = async () => {
      if (await useAuthState.getState().refreshAccessToken()) schedule()
      else timer = setTimeout(refresh, REFRESH_RETRY_MS)
    }

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return
      clearTimeout(timer)
      schedule()
    }

    schedule()
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      clearTimeout(timer)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [loggedIn])
}

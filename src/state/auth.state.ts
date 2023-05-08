import { ExtractAtKey } from "@thoth/models/types"
import { create } from "zustand"
import { combine, createJSONStorage, persist } from "zustand/middleware"
import { decodeJWT, Jwt } from "@thoth/utils/jwt"

export type AuthState =
  | {
      loggedIn: false
      accessToken: undefined
      refreshToken: undefined
      decodedAccessToken: undefined
    }
  | {
      loggedIn: true
      accessToken: string
      refreshToken: string
      decodedAccessToken: ExtractAtKey<Jwt, "payload", { type: "access" }>
      decodedRefreshToken: ExtractAtKey<Jwt, "payload", { type: "refresh" }>
    }

const INITIAL_USER_STATE: AuthState = {
  loggedIn: false,
  refreshToken: undefined,
  accessToken: undefined,
  decodedAccessToken: undefined,
}

export const useAuthState = create(
  persist(
    combine(INITIAL_USER_STATE as AuthState, (set, get, modify) => ({
      login: (accessToken: string, refreshToken: string) => {
        const state = get()
        const decodedAccessToken = decodeJWT(accessToken) as ExtractAtKey<Jwt, "payload", { type: "access" }>
        const decodedRefreshToken = decodeJWT(refreshToken) as ExtractAtKey<Jwt, "payload", { type: "refresh" }>
        set({
          loggedIn: true,
          accessToken,
          refreshToken,
          decodedAccessToken,
          decodedRefreshToken,
        })
      },
      logout: () => {
        modify.setState(INITIAL_USER_STATE)
      },
    })),
    {
      name: "auth",
    }
  )
)

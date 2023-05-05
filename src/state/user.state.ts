import { ExtractAtKey } from "@thoth/models/types"
import { create } from "zustand"
import { combine } from "zustand/middleware"
import { decodeJWT, Jwt } from "@thoth/utils/jwt"

type UserState =
  | {
      loggedIn: false
    }
  | {
      loggedIn: true
      accessToken: string
      refreshToken: string
      decodedAccessToken: ExtractAtKey<Jwt, "payload", { type: "access" }>
      decodedRefreshToken: ExtractAtKey<Jwt, "payload", { type: "refresh" }>
    }

const INITIAL_USER_STATE: UserState = {
  loggedIn: false,
}

export const useUserState = create(
  combine(INITIAL_USER_STATE as UserState, (set, get) => ({
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
      set(INITIAL_USER_STATE)
    },
  }))
)

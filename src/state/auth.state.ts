import { ExtractAtKey } from "@thoth/models/types"
import { create } from "zustand"
import { combine, persist } from "zustand/middleware"
import { decodeJWT, Jwt } from "@thoth/utils/jwt"
import { Api, LoginUser } from "@thoth/client"

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

const INITIAL_USER_STATE: AuthState = {
  loggedIn: false,
  accessTokenStr: undefined,
  accessToken: undefined,
}

export const useAuthState = create(
  persist(
    combine(INITIAL_USER_STATE as AuthState, (set, get, modify) => ({
      async login(userPw: LoginUser) {
        const jwt = await Api.loginUser(userPw)
        if (!jwt.success) return
        const { accessToken } = jwt.body
        const decodedAccessToken = decodeJWT(accessToken)
        set({
          loggedIn: true,
          accessTokenStr: accessToken,
          accessToken: decodedAccessToken,
        })
      },
      async register(userPw: LoginUser) {
        const user = await Api.registerUser(userPw)
        if (!user.success) return
        await this.login(userPw)
      },
      logout() {
        modify.setState(INITIAL_USER_STATE)
      },
      async refreshAccessToken() {
        const newAccessToken = await Api.refreshAccessToken()
        if (!newAccessToken.success) return
        set({
          loggedIn: true,
          accessTokenStr: newAccessToken.body.accessToken,
          accessToken: decodeJWT(newAccessToken.body.accessToken),
        })
      },
    })),
    {
      name: "auth",
    }
  )
)

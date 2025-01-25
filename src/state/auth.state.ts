import { create } from "zustand"
import { combine, persist } from "zustand/middleware"
import { decodeJWT, Jwt } from "@thoth/utils/jwt"
import { Api, ThothLoginUser } from "@thoth/client"

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
    combine(INITIAL_USER_STATE as AuthState, (set, _get, modify) => ({
      login: async (userPw: ThothLoginUser) => {
        const jwt = await Api.loginUser(userPw)
        if (!jwt.success) return jwt
        const { accessToken } = jwt.body
        const decodedAccessToken = decodeJWT(accessToken)
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
        await Api.logoutUser()
      },
      refreshAccessToken: async () => {
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

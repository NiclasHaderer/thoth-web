import { createApi } from "./generated/client"
import { ApiCallData, ApiInterceptor, ApiResponse } from "./generated/models"
import { AuthState, useAuthState } from "@thoth/state/auth.state"
import { isExpired } from "@thoth/utils/jwt"
import { unstable_batchedUpdates } from "react-dom"

export * from "./generated/models"

const authInterceptor: ApiInterceptor = async (data: ApiCallData): Promise<ApiCallData> => {
  const authState = useAuthState.getState() as AuthState
  let executor: (callData: ApiCallData) => Promise<Response | ApiResponse<any>> = data.executor
  if (data.requiresAuth) {
    console.warn(authState)
    if (authState.loggedIn) {
      if (isExpired(authState.accessToken)) {
        await unstable_batchedUpdates(async () => await useAuthState.getState().refreshAccessToken())
      }
      executor = (...args) =>
        data.executor(...args).then(e => {
          if (e instanceof Response && e.status === 401) {
            unstable_batchedUpdates(() => useAuthState.getState().logout())
          }
          return e
        })

      data.headers.set("Authorization", `Bearer ${useAuthState.getState().accessTokenStr}`)
    } else {
      executor = () => Promise.resolve({ success: false, error: "Not logged in" })
    }
  }
  return {
    ...data,
    executor,
  }
}

export const Api = createApi({}, [authInterceptor])

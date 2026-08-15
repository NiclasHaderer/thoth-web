import { unstable_batchedUpdates } from "react-dom"
import { AuthState, useAuthState } from "@thoth/state/auth.state"
import { isExpired } from "@thoth/utils/jwt"
import { createApi } from "./generated/api-client"
import { ApiCallData, ApiInterceptor, ApiResponse } from "./generated/client"

export * from "./generated/models"
export * from "./error"
export type { ApiResponse, ApiError } from "./generated/client"

const SESSION_EXPIRED: ApiResponse<never> = { success: false, error: "Session expired", status: 401 }

const refreshSession = (): Promise<boolean> =>
  unstable_batchedUpdates(() => useAuthState.getState().refreshAccessToken())

const endSession = (): Promise<void> => unstable_batchedUpdates(() => useAuthState.getState().logout())

const authorize = (callData: ApiCallData): ApiCallData => {
  callData.headers.set("Authorization", `Bearer ${useAuthState.getState().accessTokenStr}`)
  return callData
}

const authInterceptor: ApiInterceptor = async (data: ApiCallData): Promise<ApiCallData> => {
  if (!data.requiresAuth) return data

  const authState = useAuthState.getState() as AuthState
  if (!authState.loggedIn) {
    return { ...data, executor: () => Promise.resolve({ success: false, error: "Not logged in" }) }
  }

  if (isExpired(authState.accessToken) && !(await refreshSession())) {
    await endSession()
    return { ...data, executor: () => Promise.resolve(SESSION_EXPIRED) }
  }

  const executor = async (callData: ApiCallData): Promise<Response | ApiResponse<unknown>> => {
    const response = await data.executor(authorize(callData))
    if (!(response instanceof Response) || response.status !== 401) return response

    if (!(await refreshSession())) {
      await endSession()
      return response
    }
    return data.executor(authorize(callData))
  }

  return { ...data, executor }
}

export const Api = createApi({}, [authInterceptor])

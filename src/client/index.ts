import { createApi } from "./generated/client"
import { ApiCallData, ApiInterceptor, ApiResponse } from "./generated/models"
import { AuthState, useAuthState } from "@thoth/state/auth.state"
export * from "./generated/models"

const authInterceptor: ApiInterceptor = (data: ApiCallData): ApiCallData => {
  const authState = useAuthState.getState() as AuthState
  let executor: (callData: ApiCallData) => Promise<Response | ApiResponse<any>> = data.executor
  if (data.requiresAuth) {
    if (authState.loggedIn) {
      data.headers.set("Authorization", `Bearer ${authState.accessToken}`)
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

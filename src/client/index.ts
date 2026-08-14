import { unstable_batchedUpdates } from "react-dom"
import { AuthState, useAuthState } from "@thoth/state/auth.state"
import { isExpired } from "@thoth/utils/jwt"
import { apiErrorMessage } from "@thoth/utils/utils"
import { createApi } from "./generated/api-client"
import { ApiCallData, ApiError, ApiInterceptor, ApiResponse } from "./generated/client"

export * from "./generated/models"
export type { ApiResponse, ApiError } from "./generated/client"

export class ThothApiError extends Error {
  readonly status: number | undefined
  readonly error: ApiError["error"]

  constructor(response: ApiError) {
    super(apiErrorMessage(response.error))
    this.name = "ThothApiError"
    this.status = response.status
    this.error = response.error
  }
}

export const unwrap = async <T>(response: Promise<ApiResponse<T>>): Promise<T> => {
  const result = await response
  if (!result.success) throw new ThothApiError(result)
  return result.body
}

const authInterceptor: ApiInterceptor = async (data: ApiCallData): Promise<ApiCallData> => {
  const authState = useAuthState.getState() as AuthState
  let executor: (callData: ApiCallData) => Promise<Response | ApiResponse<unknown>> = data.executor
  if (data.requiresAuth) {
    if (authState.loggedIn) {
      if (isExpired(authState.accessToken)) {
        await unstable_batchedUpdates(async () => await useAuthState.getState().refreshAccessToken())
      }
      executor = (...args) =>
        data.executor(...args).then(e => {
          // Only treat a 401 as a dead session when our token is actually expired
          // (i.e. the pre-request refresh failed). A 401 on a still-valid token is an
          // authorization failure (e.g. an admin-only endpoint), not a reason to log out.
          const token = useAuthState.getState().accessToken
          if (e instanceof Response && e.status === 401 && token && isExpired(token)) {
            return unstable_batchedUpdates(() => useAuthState.getState().logout()).then(() => e)
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

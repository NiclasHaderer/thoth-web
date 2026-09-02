import { unstable_batchedUpdates } from "react-dom"
import { AuthState, useAuthState } from "@thoth/state/auth.state"
import { isExpired } from "@thoth/utils/jwt"
import { ThothApiError } from "./error"
import { createApi } from "./generated/api-client"
import { ApiCallData, ApiInterceptor, ApiResponse } from "./generated/client"
import { httpInterceptor } from "./http-interceptor.ts"

export * from "./generated/models"
export * from "./error"

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

const rawApi = createApi({}, import.meta.env.DEV ? [authInterceptor, httpInterceptor] : [authInterceptor])

type Throwing<A> = {
  [K in keyof A]: A[K] extends (...args: infer P) => Promise<ApiResponse<infer R>> ? (...args: P) => Promise<R> : never
}

const unwrap = async <T>(response: Promise<ApiResponse<T>>): Promise<T> => {
  const result = await response
  if (!result.success) throw new ThothApiError(result)
  return result.body
}

type RawCall = (...args: unknown[]) => Promise<ApiResponse<unknown>>

export const Api = Object.fromEntries(
  Object.entries(rawApi).map(([name, call]) => [name, (...args: unknown[]) => unwrap((call as RawCall)(...args))])
) as Throwing<typeof rawApi>

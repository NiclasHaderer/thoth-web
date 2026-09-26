import { createApi } from "./generated/api-client"
import { ApiCallData, ApiInterceptor, ApiResponse } from "./generated/client"
import { httpInterceptor } from "./http-interceptor.ts"
import { throwing } from "./public-api"
import { authorizationHeader, renewedAuthorizationHeader } from "./session"

export * from "./generated/models"
export * from "./api-error"
export * from "./public-api"
export * from "./session"

const authInterceptor: ApiInterceptor = (data: ApiCallData): ApiCallData => {
  if (!data.requiresAuth) return data

  const send = async (callData: ApiCallData, header: () => Promise<ApiResponse<string>>) => {
    const authorization = await header()
    if (!authorization.success) return authorization
    callData.headers.set("Authorization", authorization.body)
    return data.executor(callData)
  }

  const executor = async (callData: ApiCallData): Promise<Response | ApiResponse<unknown>> => {
    const response = await send(callData, authorizationHeader)
    if (!(response instanceof Response) || response.status !== 401) return response
    return send(callData, renewedAuthorizationHeader)
  }

  return { ...data, executor }
}

export const Api = throwing(createApi({}, import.meta.env.DEV ? [authInterceptor, httpInterceptor] : [authInterceptor]))

import { HTTP_METHOD, QueryParameters, RequestBody, TClient, WrappedResponse } from "./client"

type ErrorType = { error: string; url: string; method: HTTP_METHOD }
const ERROR_KEY = "client-error"

const globalErrorDispatcher = new EventTarget()

export const GlobalClientErrors = {
  subscribe: (callback: (e: ErrorType) => any) => {
    const callbackWrapper = (e: CustomEvent<ErrorType>) => callback(e.detail)
    globalErrorDispatcher.addEventListener(ERROR_KEY, callbackWrapper as any)
    return {
      unsubscribe: () => globalErrorDispatcher.removeEventListener(ERROR_KEY, callbackWrapper as any),
    }
  },
} as const

const getErrorMessage = (body: any): string => {
  try {
    if ("error" in body) return body.error
    return "Unknown error. Please look in the browser console for more details"
  } catch (e) {
    return "Unknown error. Please look in the browser console for more details."
  }
}

export const withErrorHandler = <C extends TClient>(
  client: C,
  errorCallback: (error: any, body: any | null) => void = console.warn
): C => {
  return {
    ...client,
    request<T>(
      method: HTTP_METHOD,
      url: string,
      params?: QueryParameters,
      body?: RequestBody
    ): Promise<WrappedResponse<T>> {
      return client
        .request<T>(method, url, params, body)
        .then(r => {
          if (r.success) return r

          errorCallback(null, r.data)
          globalErrorDispatcher.dispatchEvent(
            new CustomEvent<ErrorType>(ERROR_KEY, {
              detail: {
                error: getErrorMessage(r),
                url,
                method,
              },
            })
          )
          return r
        })

        .catch(async reason => {
          errorCallback(reason, reason)
          const errorMessage = await getErrorMessage(reason)
          globalErrorDispatcher.dispatchEvent(
            new CustomEvent<ErrorType>(ERROR_KEY, {
              detail: {
                error: errorMessage,
                url,
                method,
              },
            })
          )
          return { data: reason, success: false }
        })
    },
  }
}

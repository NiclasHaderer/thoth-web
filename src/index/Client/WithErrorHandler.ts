import { HTTP_METHOD, QueryParameters, RequestBody, TClient } from "./Client"

type ErrorType = { error: string; url: string; method: HTTP_METHOD }
const ERROR_KEY = "client-error"

const errorTarget = new EventTarget()

export const GlobalClientErrors = {
  subscribe: (callback: (e: ErrorType) => any) => {
    const callbackWrapper = (e: CustomEvent<ErrorType>) => {
      callback(e.detail)
    }
    errorTarget.addEventListener(ERROR_KEY, callbackWrapper as any)
    return {
      unsubscribe: () => errorTarget.removeEventListener(ERROR_KEY, callbackWrapper as any),
    }
  },
} as const

const getErrorMessage = async (body: any): Promise<{ error: string }> => {
  try {
    if ("error" in body) return body
    return { error: "Unknown error. Please look in the browser console for more details." }
  } catch (e) {
    return { error: "Unknown error. Please look in the browser console for more details." }
  }
}

export const withErrorHandler = <C extends TClient>(
  client: C,
  errorCallback: (error: any, body: any | null) => void = console.warn
): C => {
  return {
    ...client,
    request<T>(method: HTTP_METHOD, url: string, params?: QueryParameters, body?: RequestBody): Promise<T | undefined> {
      return client.request<T>(method, url, params, body).catch(async reason => {
        let body = null
        try {
          body = await reason.text()
          body = JSON.parse(body)
        } catch {}

        errorCallback(reason, body)
        const errorMessage = await getErrorMessage(body)
        errorTarget.dispatchEvent(new CustomEvent<ErrorType>(ERROR_KEY, { detail: { ...errorMessage, url, method } }))
        return undefined
      })
    },
  }
}

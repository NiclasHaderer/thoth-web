import { TClient } from "./Client"

export const withErrorHandler = <C extends TClient>(
  client: C,
  errorCallback: (error: any) => void = console.warn
): C => {
  return {
    ...client,
    request<T>(...args: Parameters<TClient["request"]>): Promise<T | undefined> {
      return client.request<T>(...args).catch(reason => {
        errorCallback(reason)
        return undefined
      })
    },
  }
}

import { TCachingClient, TInternalCachingClient } from "./WithCaching"
import { QueryParameters, withSearchParams } from "./Client"

export type TRenewClient = {
  renewCache(force: boolean): void
  on<T>(url: string, callback: (result: T) => void, params?: QueryParameters): { unsubscribe: () => void }
} & TCachingClient

export const withRenew = <C extends TCachingClient>(cachingClient: C): C & TRenewClient => {
  const _cacheClient = cachingClient as unknown as TInternalCachingClient
  const cache = _cacheClient.getCache()
  const expiry = _cacheClient.getExpiry()

  const eventTarget = new EventTarget()
  return {
    ...cachingClient,
    get<T>(url: string, params?: QueryParameters): Promise<T> {
      const cacheKey = withSearchParams(url, params)

      const result = _cacheClient.get<T>(cacheKey, params)
      eventTarget.dispatchEvent(new CustomEvent(cacheKey, { detail: result }))
      return result
    },
    renewCache(force: boolean = true): void {
      const currentTime = new Date().getTime()
      for (const [key, value] of Object.entries(cache.entry)) {
        if (force || value.entryDate + expiry < currentTime) {
          _cacheClient.get(key, undefined, true)
        }
      }
    },
    on<T>(url: string, callback: (result: T) => void, params?: QueryParameters): { unsubscribe: () => void } {
      url = withSearchParams(url, params)

      const callbackWrapper = (event: Event) => {
        callback((event as CustomEvent<T>).detail)
      }

      eventTarget.addEventListener(url.toString(), callbackWrapper)
      return {
        unsubscribe: () => {
          eventTarget.removeEventListener(url.toString(), callbackWrapper)
        },
      }
    },
  }
}

import { TCachingClient, TInternalCachingClient } from "./WithCaching"

export const withPersistence = <C extends TCachingClient>(
  client: C,
  { storage = sessionStorage, cacheName = "client_cache" } = {}
): C => {
  const _cacheClient = client as unknown as TInternalCachingClient
  const cache = _cacheClient.getCache()
  const storageValue = storage.getItem(cacheName)
  if (storageValue) cache.entry = JSON.parse(storageValue)

  return {
    ...client,
    async get<T>(url: string, forceNew = false): Promise<T> {
      return _cacheClient.get<T>(url, forceNew).then(response => {
        storage.setItem(cacheName, JSON.stringify(cache.entry))
        return response
      })
    },
    expire(): void {
      _cacheClient.expire()
      storage.setItem(cacheName, "{}")
    },
  }
}

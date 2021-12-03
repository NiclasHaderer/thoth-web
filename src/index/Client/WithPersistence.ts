import { CacheHolder, TCachingClient } from './WithCaching';


export const withPersistence = <C extends TCachingClient>(client: C, {
  storage = sessionStorage,
  cacheName = 'client_cache'
} = {}): C => {
  const _cacheClient = client as unknown as TCachingClient & { getCache(): CacheHolder, getExpiry(): number; };
  const cache = _cacheClient.getCache();
  return {
    ...client,
    async get<T>(url: string, forceNew = false): Promise<T> {
      const response = await _cacheClient.get<T>(url, forceNew);
      storage.setItem(cacheName, JSON.stringify(cache.entry));
      return response;
    },
    expire(): void {
      _cacheClient.expire();
      storage.setItem(cacheName, '{}');
    }
  };
};

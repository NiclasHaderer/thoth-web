import { CacheHolder, TCachingClient } from './WithCaching';

export type TRenewClient = {
    renewCache(force: boolean): void,
    on<T>(url: string, callback: (result: T) => void): { unsubscribe: () => void }
  }
  & TCachingClient;


export const withRenew = <C extends TCachingClient>(cachingClient: C): C & TRenewClient => {
  const _cacheClient = cachingClient as unknown as TCachingClient & { getCache(): CacheHolder, getExpiry(): number; };
  const cache = _cacheClient.getCache();
  const expiry = _cacheClient.getExpiry();

  const eventTarget = new EventTarget();
  return {
    ...cachingClient,
    get<T>(url: string): Promise<T> {
      const result = _cacheClient.get<T>(url);
      eventTarget.dispatchEvent(new CustomEvent(url, {detail: result}));
      return result;
    },
    renewCache(force: boolean = true): void {
      const currentTime = new Date().getTime();
      for (const [key, value] of Object.entries(cache.entry)) {
        if (force || value.entryDate + expiry < currentTime) {
          _cacheClient.get(key, true);
        }
      }
    },
    on<T>(url: string, callback: (result: T) => void): { unsubscribe: () => void } {

      const callbackWrapper = (event: Event) => {
        callback((event as CustomEvent<T>).detail);
      };

      eventTarget.addEventListener(url, callbackWrapper);
      return {
        unsubscribe: () => {
          eventTarget.removeEventListener(url, callbackWrapper);
        }
      };
    }
  };
};

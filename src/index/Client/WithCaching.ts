import { TClient } from './Client';

export type TCachingClient = {
  expire(): void;
  get<T>(url: string, forceNew?: boolean): Promise<T>;
};

type Cache = Record<string, CacheEntry<any>>;
export type CacheHolder = { entry: Cache };

export type CacheEntry<T> = {
  entryDate: number,
  entry: T
}

const getEntryFromCache = <T>(cache: Cache, key: string, expiresAfter: number): { hasEntry: true, value: T } | { hasEntry: false, value: null } => {
  if (!(key in cache)) return {hasEntry: false, value: null};
  const cacheEntry = cache[key];

  const currentTime = new Date().getTime();
  if (cacheEntry.entryDate + expiresAfter < currentTime) {
    delete cache[key];
    return {hasEntry: false, value: null};
  }

  return {hasEntry: true, value: cacheEntry.entry};
};

const saveEntryInCache = (cache: Cache, key: string, value: any) => {
  const currentTime = new Date().getTime();
  cache[key] = {
    entryDate: currentTime,
    entry: value
  };
};

const globalCache: CacheHolder = {entry: {}};

export const withCaching = <C extends TClient>(client: C, {expiresSeconds = 1800, useGlobalCache = true} = {}): C & TCachingClient => {
  const expiresMs = expiresSeconds * 1000;

  const cache: CacheHolder = useGlobalCache ? globalCache : {entry: {}};

  return {
    ...client,
    async get<T>(url: string, forceNew = false): Promise<T> {
      if (!forceNew) {
        const cacheEntry = getEntryFromCache<T>(cache.entry, url, expiresMs);
        if (cacheEntry.hasEntry) return Promise.resolve(cacheEntry.value);
      }
      const response = await client.get<T>(url);
      saveEntryInCache(cache.entry, url, response);
      return response;
    },
    expire(): void {
      cache.entry = {};
    },
    getCache(): CacheHolder {
      return cache;
    },
    getExpiry(): number {
      return expiresMs;
    }
  };

};

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { clear, createStore, del, get, set } from "idb-keyval"

export const idbStore = createStore("thoth", "offline")

export const CACHE_BUSTER = __APP_VERSION__

export const persister = createAsyncStoragePersister({
  key: "query-cache",
  throttleTime: 1000,
  storage: {
    getItem: key => get<string>(key, idbStore),
    setItem: (key, value) => set(key, value, idbStore),
    removeItem: key => del(key, idbStore),
  },
})

export const purgePersistedCache = () => clear(idbStore)

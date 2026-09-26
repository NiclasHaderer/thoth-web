import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { createStore, del, get, set } from "idb-keyval"
import type { StateStorage } from "zustand/middleware"
import { PublicApi } from "./public-api"
import { queryClient } from "./query-client"

export const persistKey = (name: string) => `thoth.${name}`

const idbStore = createStore("thoth", "offline")

export const idbStorage = {
  getItem: (key: string) => get<string>(key, idbStore).then(value => value ?? null),
  setItem: (key: string, value: string) => set(key, value, idbStore),
  removeItem: (key: string) => del(key, idbStore),
} satisfies StateStorage<Promise<void>>

export const CACHE_BUSTER = PublicApi.apiVersion

export const persister = createAsyncStoragePersister({
  key: persistKey("query-cache"),
  throttleTime: 1000,
  storage: idbStorage,
})

export const cache = {
  reset: async () => {
    queryClient.clear()
    await persister.removeClient()
  },
}

import { useEffect, useState } from "react"

export type StorageUsage = { usage: number; quota: number; persisted: boolean }

export const useStorageUsage = (refreshKey: unknown) => {
  const [storage, setStorage] = useState<StorageUsage>()
  useEffect(() => {
    void Promise.all([navigator.storage.estimate(), navigator.storage.persisted()]).then(([estimate, persisted]) =>
      setStorage({ usage: estimate.usage ?? 0, quota: estimate.quota ?? 0, persisted })
    )
  }, [refreshKey])
  return storage
}

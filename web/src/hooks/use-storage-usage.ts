import { useEffect, useState } from "react"

export type StorageUsage = { usage: number; quota: number }

export const useStorageUsage = (refreshKey: unknown) => {
  const [storage, setStorage] = useState<StorageUsage>()
  useEffect(() => {
    void navigator.storage
      .estimate()
      .then(estimate => setStorage({ usage: estimate.usage ?? 0, quota: estimate.quota ?? 0 }))
  }, [refreshKey])
  return storage
}

import { useEffect } from "react"

export const useOnMount = (effect: () => (void | (() => void)) | Promise<void>) => {
  useEffect(() => {
    const result = effect()
    if (result instanceof Promise) return
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useOnUnMount = (effect: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => effect, [])
}

import { EffectCallback, useEffect } from "react"

export const useOnMount = (effect: EffectCallback) => {
  useEffect(() => {
    effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useOnUnMount = (effect: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => effect, [])
}

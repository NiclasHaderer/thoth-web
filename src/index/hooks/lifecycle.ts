import { EffectCallback, useEffect } from "react"

export const useOnMount = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}

export const useOnUnMount = (effect: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => effect, [])
}

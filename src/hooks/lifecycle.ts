import { useEffect } from "react"

export const useOnMount = (effect: () => unknown) => {
  useEffect(() => void effect(), [])
}

export const useOnUnMount = (effect: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => effect, [])
}

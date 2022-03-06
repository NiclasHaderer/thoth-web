import { useOnMount } from "./OnMount"

export const useScrollTo = (selector: string) => {
  useOnMount(() => {
    const element = document.querySelector(selector)
    element && element.scrollTo(0, 0)
  })
}

import { ReactNode, useEffect, useState } from "react"

export const NoSsr = ({ children }: { children?: ReactNode }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return mounted ? <>{children}</> : null
}

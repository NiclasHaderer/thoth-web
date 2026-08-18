import { FC, PropsWithChildren } from "react"

export const RESPONSIVE_GRID =
  "grid w-full grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))]"

export const ResponsiveGrid: FC<PropsWithChildren> = ({ children }) => {
  return <div className={RESPONSIVE_GRID}>{children}</div>
}

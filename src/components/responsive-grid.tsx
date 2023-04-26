import { FC, PropsWithChildren } from "react"

export const ResponsiveGrid: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="grid w-full grid-cols-2 justify-items-center
  gap-4
  sm:grid-cols-3
  md:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  2xl:grid-cols-6
  3xl:grid-cols-7
  4xl:grid-cols-8
  "
    >
      {children}
    </div>
  )
}

import React from "react"

export const ResponsiveGrid: React.FC = ({ children }) => {
  return (
    <div
      className="w-full justify-items-center grid gap-4
  grid-cols-2
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

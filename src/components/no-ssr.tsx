import dynamic from "next/dynamic"
import React from "react"

const NoSSR_ = ({ children }: { children?: React.ReactNode }) => <>{children}</>

export const NoSSR = dynamic(() => Promise.resolve(NoSSR_), {
  ssr: false,
})

import React from "react"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full p-2 sm:max-w-4/5 sm:p-0 lg:max-w-3/5 xl:max-w-1/2">{children}</div>
}

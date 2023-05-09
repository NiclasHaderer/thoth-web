"use client"

import React from "react"
import { RequireLogin } from "@thoth/components/require-login"
import { SearchBar } from "@thoth/components/menu/top-bar"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchBar />
      <div className="flex flex-grow flex-col overflow-y-auto">
        <RequireLogin>{children}</RequireLogin>
      </div>
    </>
  )
}

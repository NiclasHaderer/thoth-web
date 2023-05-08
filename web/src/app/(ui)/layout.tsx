"use client"

import { SearchBar } from "@thoth/components/menu/menu"
import React from "react"
import { RequireLogin } from "@thoth/components/require-login"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchBar />
      <div className="flex flex-grow flex-col">
        <RequireLogin>{children}</RequireLogin>
      </div>
    </>
  )
}

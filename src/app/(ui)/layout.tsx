import React from "react"
import { RequireLogin } from "@thoth/components/require-login"
import { SearchBar } from "@thoth/components/menu/top-bar"
import { UrlWatcher } from "@thoth/components/url-watcher"

export const UiLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UrlWatcher>
      <SearchBar />
      <div className="flex flex-grow flex-col overflow-y-auto">
        <RequireLogin>{children}</RequireLogin>
      </div>
    </UrlWatcher>
  )
}

import { FC, ReactNode } from "react"
import { SearchBar } from "@thoth/components/menu/top-bar"
import { RequireLogin } from "@thoth/components/require-login"

export const UiLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <RequireLogin>
      <SearchBar />
      <div className="flex grow flex-col overflow-y-auto">{children}</div>
    </RequireLogin>
  )
}

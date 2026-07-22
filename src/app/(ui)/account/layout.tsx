import { FC, ReactNode } from "react"

export const AccountLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-2 sm:p-0">{children}</div>
}

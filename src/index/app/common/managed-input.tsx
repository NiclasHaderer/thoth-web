import React from "react"
import { Input, InputProps } from "./input"
import { useInputUpdater } from "../../hooks/form"

export const ManagedInput: React.VFC<{ name: string } & InputProps> = ({ name, ...rest }) => {
  const updater = useInputUpdater(name)
  return <Input {...rest} {...updater} />
}

import React from "react"
import { Input, InputProps } from "./input"
import { useFieldUpdater } from "../../hooks/form"

export const ManagedInput: React.VFC<{ name: string } & InputProps> = ({ name, ...rest }) => {
  const updater = useFieldUpdater(name)
  return <Input {...rest} {...updater} />
}

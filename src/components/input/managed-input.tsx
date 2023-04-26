import { FC } from "react"
import { Input, InputProps } from "./input"
import { useFieldUpdater } from "@thoth/hooks/form"

export const ManagedInput: FC<{ name: string } & InputProps> = ({ name, ...rest }) => {
  const updater = useFieldUpdater(name)
  return <Input {...rest} {...updater} />
}

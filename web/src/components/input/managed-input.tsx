import { FC } from "react"
import { Input, InputProps } from "./input"
import { useField, useFieldUpdater } from "@thoth/hooks/form"

export const ManagedInput: FC<{ name: string } & InputProps> = ({ name, ...rest }) => {
  const updater = useFieldUpdater(name)
  const { errors, touched } = useField(name)
  return <Input {...rest} {...updater} errors={errors} touched={touched} />
}

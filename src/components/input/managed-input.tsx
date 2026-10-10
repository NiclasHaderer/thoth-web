import { FC } from "react"
import { useField, useFieldUpdater } from "@thoth/hooks/use-form"
import { LabeledInput, LabeledInputProps } from "./labeled-input"

export const ManagedInput: FC<{ name: string } & LabeledInputProps> = ({ name, ...rest }) => {
  const updater = useFieldUpdater(name)
  const { errors, touched } = useField(name)
  return <LabeledInput {...rest} {...updater} errors={errors} touched={touched} />
}

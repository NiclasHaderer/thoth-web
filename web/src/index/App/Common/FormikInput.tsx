import React from "react"
import { useField } from "formik"
import { Input, InputProps } from "./Input"

export const FormikInput: React.VFC<InputProps & { name: string }> = ({ name, ...props }) => {
  const [field, meta] = useField(name)
  return <Input {...props} {...field} meta={meta} />
}

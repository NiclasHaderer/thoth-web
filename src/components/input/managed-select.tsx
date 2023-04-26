import { useField } from "@thoth/hooks/form"
import React from "react"
import { Select, SelectProps } from "./select"

export function ManagedSelect<T extends any, MULTIPLE extends boolean = false>({
  onChange,
  name,
  ...props
}: SelectProps<T, MULTIPLE> & {
  name: string
}) {
  const field = useField(name)

  return (
    <Select
      {...props}
      value={field.value}
      onChange={v => {
        field.setValue(v as any)
        field.setTouched(true)
        onChange?.(v)
      }}
    />
  )
}

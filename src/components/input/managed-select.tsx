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
  const { value, setValue, setTouched, errors } = useField(name)

  return (
    <Select
      {...props}
      value={value}
      onChange={v => {
        setValue(v as any)
        setTouched(true)
        onChange?.(v)
      }}
    />
  )
}

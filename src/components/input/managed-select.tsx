import { useField } from "@thoth/hooks/form"
import { Select, SelectProps } from "./select"

export function ManagedSelect<T, MULTIPLE extends boolean = false>({
  onChange,
  name,
  ...props
}: SelectProps<T, MULTIPLE> & {
  name: string
}) {
  const { value, setValue, setTouched } = useField<Record<string, unknown>, string>(name)

  return (
    <Select
      {...props}
      value={value as SelectProps<T, MULTIPLE>["value"]}
      onChange={v => {
        setValue(v)
        setTouched(true)
        onChange?.(v)
      }}
      onBlur={() => setTouched(true)}
    />
  )
}

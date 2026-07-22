import { ReactNode } from "react"
import { InputError } from "@thoth/components/input/input-error"
import { Select, SelectProps } from "@thoth/components/input/select"
import { useField } from "@thoth/hooks/form"

type SelectLineProps = {
  name: string
  label?: string | undefined
  icon?: ReactNode | undefined
  labelClassName?: string | undefined
  wrapperClassName?: string | undefined
}

export function SelectLine<T, MULTIPLE extends boolean = false>({
  wrapperClassName,
  labelClassName,
  label,
  icon,
  name,
  ...props
}: SelectProps<T, MULTIPLE> & SelectLineProps) {
  const { value, touched, setValue, setTouched, errors } = useField<Record<string, unknown>, string>(name)

  return (
    <div className="pb-4">
      <label className={`flex items-center ${wrapperClassName ?? ""}`}>
        {label ? <div className={`shrink-0 px-2 whitespace-nowrap ${labelClassName ?? ""}`}>{label}</div> : null}
        <div className="grow">
          <Select
            onBlur={() => setTouched(true)}
            {...props}
            leftIcon={icon}
            value={value as SelectProps<T, MULTIPLE>["value"]}
            placeholderButtonClassName="w-full"
            placeholderClassName="w-full"
            outerClassName="w-full"
            onChange={v => {
              const extract = (val: unknown): unknown =>
                typeof val === "object" && val !== null && "value" in val ? val.value : val
              setValue(Array.isArray(v) ? v.map(extract) : extract(v))
              setTouched(true)
            }}
          />
        </div>
      </label>
      <InputError errors={errors} show={touched} />
    </div>
  )
}

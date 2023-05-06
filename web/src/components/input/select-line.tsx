import React, { ReactNode } from "react"
import { Select, SelectProps } from "@thoth/components/input/select"
import { useField } from "@thoth/hooks/form"

type SelectLineProps = {
  name: string
  label?: string | undefined
  icon?: ReactNode | undefined
  iconPosition?: "left" | "right" | undefined
  labelClassName?: string | undefined
  wrapperClassName?: string | undefined
}

export function SelectLine<T extends any, MULTIPLE extends boolean = false>({
  wrapperClassName,
  iconPosition = "left",
  labelClassName,
  label,
  icon,
  name,
  ...props
}: SelectProps<T, MULTIPLE> & SelectLineProps) {
  const { value, touched, setValue, setTouched, errors } = useField(name)

  return (
    <>
      <label className={`flex items-center ${wrapperClassName ?? ""}`}>
        {label ? <div className={`mt-2 px-2 ${labelClassName ?? ""}`}>{label}</div> : null}
        <div className="relative mt-2 flex-grow">
          {icon ? <div className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 p-2`}>{icon}</div> : null}
          <Select
            {...props}
            value={value}
            placeholderButtonClassName={"pl-8 hover:bg-elevate w-full"}
            placeholderClassName="w-full"
            outerClassName="w-full"
            optionListClassName="w-full border-solid border-active border-1"
            onChange={v => {
              let value
              if (Array.isArray(v)) {
                value = v.map(val => (typeof val === "object" && val !== null && "value" in val ? val.value : v))
              } else {
                value = typeof v === "object" && v !== null && "value" in v ? v.value : v
              }
              setValue(value as any)
              setTouched(true)
            }}
          />
        </div>
      </label>
      <div className="flex items-center">
        <div className={labelClassName} />
        {touched && errors ? (
          <div className="error">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}

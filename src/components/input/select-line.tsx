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
  touched?: boolean | undefined
  errors?: string[] | undefined
}

export function SelectLine<T extends any, MULTIPLE extends boolean = false>({
  wrapperClassName,
  touched,
  errors,
  iconPosition = "left",
  labelClassName,
  label,
  icon,
  name,
  ...props
}: SelectProps<T, MULTIPLE> & SelectLineProps) {
  const field = useField(name)

  return (
    <label className={`flex items-center ${wrapperClassName ?? ""}`}>
      {label ? <div className={`px-2 ${labelClassName ?? ""}`}>{label}</div> : null}
      <div className="relative my-2 flex-grow">
        {icon ? <div className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 p-2`}>{icon}</div> : null}
        <Select
          {...props}
          value={field.value}
          placeholderButtonClassName={"pl-8 hover:bg-elevate w-full"}
          placeholderClassName="w-full"
          outerClassName="w-full"
          optionListClassName="w-full border-solid border-active border-1"
          onChange={v => {
            field.setValue(v as any)
            field.setTouched(true)
          }}
        />
        {touched && errors ? (
          <div className="error">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        ) : null}
      </div>
    </label>
  )
}

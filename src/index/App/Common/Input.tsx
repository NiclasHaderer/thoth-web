import { FieldMetaProps, useField } from "formik"
import React, { MutableRefObject, ReactNode } from "react"

type InputProps = Omit<Omit<React.ComponentProps<"input">, "defaultValue">, "value"> & {
  label?: string | undefined
  icon?: ReactNode | undefined
  iconPosition?: "left" | "right" | undefined
  labelClassName?: string | undefined
  defaultValue?: string | number | ReadonlyArray<string> | undefined | null
  value?: string | ReadonlyArray<string> | number | undefined | null
  wrapperClassName?: string | undefined
  meta?: FieldMetaProps<any> | undefined
  inputRef?: MutableRefObject<any> | undefined
}

export const Input: React.VFC<InputProps> = ({
  iconPosition = "left",
  icon,
  label,
  wrapperClassName,
  placeholder = label,
  labelClassName,
  defaultValue,
  className,
  value,
  meta,
  inputRef,
  ...props
}) => (
  <label className={`flex items-center ${wrapperClassName ?? wrapperClassName}`}>
    {label ? <div className={`px-2 ${labelClassName ?? labelClassName}`}>{label}</div> : null}
    <div className="relative my-2 flex-grow">
      {icon ? (
        <div
          className={`absolute top-1/2 -translate-y-1/2 p-2 ${iconPosition === "left" && icon ? "left-0" : "right-0"}`}
        >
          {icon}
        </div>
      ) : null}
      <input
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        value={value ?? undefined}
        {...props}
        ref={inputRef}
        className={`box-border w-full rounded-md bg-elevate p-2 ${iconPosition === "left" && icon ? "pl-8" : "pr-8"} ${
          className ?? ""
        }`}
      />
      {meta?.touched && meta.error ? <div className="error">{meta.error}</div> : null}
    </div>
  </label>
)

export const FormikInput: React.VFC<InputProps & { name: string }> = ({ name, ...props }) => {
  const [field, meta] = useField(name)
  return <Input {...props} {...field} meta={meta} />
}

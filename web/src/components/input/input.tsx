import React, { FC, KeyboardEvent, memo, MutableRefObject, ReactNode, useEffect, useRef, useState } from "react"

export type InputProps = Omit<Omit<React.ComponentProps<"input">, "defaultValue">, "value"> & {
  label?: string | undefined
  leftIcon?: ReactNode | undefined
  rightIcon?: ReactNode | undefined
  labelClassName?: string | undefined
  defaultValue?: string | number | ReadonlyArray<string> | undefined | null
  value?: string | ReadonlyArray<string> | number | undefined | null
  wrapperClassName?: string | undefined
  touched?: boolean | undefined
  errors?: string[] | undefined
  inputRef?: MutableRefObject<HTMLInputElement | null> | undefined
  preventSubmit?: boolean
  onValue?: (value: string) => void
  onEnter?: (event: KeyboardEvent<HTMLInputElement>) => void
}

export const Input: FC<InputProps> = memo(
  ({
    leftIcon,
    rightIcon,
    label,
    wrapperClassName,
    placeholder = label,
    labelClassName,
    defaultValue,
    className,
    preventSubmit = true,
    value,
    onValue,
    onEnter,
    onKeyDown,
    onChange,
    touched,
    errors,
    inputRef,
    ...props
  }) => {
    const ref = useRef<HTMLInputElement | null>(null)
    const [cursor, setCursor] = useState<number | null>(null)

    useEffect(() => {
      const input = ref.current
      if (input) input.setSelectionRange(cursor, cursor)
    }, [ref, cursor, value])

    return (
      <>
        <label className={`flex items-center ${wrapperClassName ?? ""}`}>
          {label ? <div className={`mt-2 px-2 ${labelClassName ?? ""}`}>{label}</div> : null}
          <div className="relative mt-2 flex-grow">
            {leftIcon ? <div className={`absolute left-0 top-1/2 -translate-y-1/2 p-2`}>{leftIcon}</div> : null}
            {rightIcon ? <div className={`absolute right-0 top-1/2 -translate-y-1/2 p-2`}>{rightIcon}</div> : null}
            <input
              onKeyDown={event => {
                if (event.key === "Enter") {
                  if (preventSubmit) event.preventDefault()
                  if (onEnter) onEnter(event)
                }
                if (onKeyDown) onKeyDown(event)
              }}
              onChange={event => {
                if (onValue) onValue(event.target.value)
                if (onChange) onChange(event)
                setCursor(event.target.selectionStart)
              }}
              placeholder={placeholder}
              defaultValue={defaultValue ?? undefined}
              value={value ?? undefined}
              {...props}
              ref={instance => {
                if (inputRef) inputRef.current = instance
                ref.current = instance
                return ref
              }}
              className={`box-border w-full rounded-md bg-elevate p-2 ${leftIcon !== undefined && "pl-8"} ${
                rightIcon !== undefined && "pr-8"
              } ${className ?? ""}`}
            />
          </div>
        </label>
        <div className="flex items-center">
          <div className={labelClassName}> {"                 "} </div>
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
)
Input.displayName = "Input"

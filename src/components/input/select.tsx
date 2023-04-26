import { Listbox, Transition } from "@headlessui/react"
import React, { Fragment, ReactNode, useEffect, useState } from "react"
import { MdDone } from "react-icons/md"

export type SelectProps<T extends any, MULTIPLE extends boolean = false> = {
  options: (
    | {
        value: T
        disabled?: boolean
      }
    | T
  )[]
  title: ReactNode
  displayValue?: (v: T) => ReactNode
  disabled?: boolean
  vDir?: "top" | "bottom"
  hDir?: "right" | "left"
  value?: T
  multiple?: MULTIPLE
  onChange?: (v: MULTIPLE extends true ? T[] : T) => void
  outerClassName?: string
  placeholderButtonClassName?: string
  placeholderClassName?: string
  optionClassName?: string
  optionListClassName?: string
}

export function Select<T extends any, MULTIPLE extends boolean = false>({
  options,
  disabled,
  title,
  vDir = "bottom",
  hDir = "left",
  value,
  placeholderButtonClassName,
  placeholderClassName,
  optionClassName,
  optionListClassName,
  outerClassName,
  onChange,
  multiple,
  displayValue = (v: T) => v?.toString() ?? "",
}: SelectProps<T, MULTIPLE>) {
  const [selected, setSelected] = useState(value)
  useEffect(() => setSelected(value), [value])

  return (
    <Listbox
      disabled={disabled}
      value={selected}
      onChange={value => {
        setSelected(value)
        onChange?.(value as MULTIPLE extends true ? T[] : T)
      }}
      multiple={multiple}
      as="div"
      className={`relative inline-block h-fit ${outerClassName ?? ""}`}
    >
      <Listbox.Button
        className={`flex min-w-32 cursor-pointer items-center overflow-hidden rounded bg-elevate p-1 text-left hover:bg-active-light focus:bg-active-light ${
          placeholderButtonClassName ?? ""
        }`}
      >
        <span className={`h-full w-full p-1 ${placeholderClassName || ""}`}>
          {!selected || (Array.isArray(selected) && selected.length === 0)
            ? title
            : multiple
            ? (selected as T[]).map(displayValue).join(", ")
            : displayValue(selected as T)}
        </span>
        <SelectIcon />
      </Listbox.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <Listbox.Options
          className={`${hDir === "right" ? "right-0" : "left-0"} ${
            vDir === "top" ? "top-0 mb-2 -translate-y-full" : "mt-2"
          } absolute z-20 w-56 origin-top-right overflow-hidden rounded-md bg-surface ${optionListClassName ?? ""}`}
        >
          <div className="bg-elevate">
            <div className="px-1 py-1">
              {options.map((ogValue, i) => {
                let value: T
                let disabled: boolean
                if (typeof ogValue === "object" && ogValue !== null && "value" in ogValue && "disabled" in ogValue) {
                  value = ogValue.value
                  disabled = ogValue.disabled ?? false
                } else {
                  value = ogValue as T
                  disabled = false
                }

                return (
                  <Listbox.Option
                    key={i}
                    disabled={disabled}
                    value={value}
                    className={({ active }) =>
                      `relative flex overflow-hidden rounded pl-7 ${active ? "bg-active-light" : ""} ${
                        optionClassName ?? ""
                      }`
                    }
                  >
                    {({ selected, disabled }) => (
                      <>
                        {selected ? <MdDone className="absolute left-1 top-1/2 h-7 w-7 -translate-y-1/2 p-1" /> : null}
                        <button
                          type="button"
                          disabled={disabled}
                          className={`group flex w-full items-center rounded-md px-2 py-2`}
                        >
                          {displayValue(value)}
                        </button>
                      </>
                    )}
                  </Listbox.Option>
                )
              })}
            </div>
          </div>
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}

const SelectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
  </svg>
)

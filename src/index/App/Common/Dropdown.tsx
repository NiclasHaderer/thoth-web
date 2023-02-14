import { Menu, Transition } from "@headlessui/react"
import React, { Fragment } from "react"

type DropdownProps<T extends any> = {
  options: {
    value: T
    disabled?: boolean
  }[]
  title: string
  vDir?: "top" | "bottom"
  hDir?: "right" | "left"
  onChange?: (v: T) => void
  valueDisplay?: (v: T) => {}
}

export function Dropdown<T extends any>({
  options,
  title,
  vDir = "bottom",
  hDir = "left",
  onChange,
  valueDisplay,
}: DropdownProps<T>) {
  return (
    <Menu as="div" className="relative inline-block h-fit text-left">
      <Menu.Button className="group cursor-pointer overflow-hidden rounded">
        <span className="h-full w-full p-1 group-hover:bg-active-light group-focus:bg-active-light">{title}</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`${hDir === "right" ? "right-0" : "left-0"} ${
            vDir === "top" ? "top-0 mb-2 -translate-y-full" : "mt-2"
          } absolute z-10 w-56 origin-top-right overflow-hidden rounded-md bg-surface`}
        >
          <div className="bg-elevate">
            <div className="px-1 py-1">
              {options.map(({ value, disabled }, i) => (
                <Menu.Item
                  key={i}
                  disabled={disabled}
                >
                  {({ active, disabled }) => (
                    <button
                      onClick={() => {
                        onChange && onChange(value)
                      }}
                      type="button"
                      disabled={disabled}
                      className={`${active && !disabled ? "bg-active-light" : ""} ${
                        disabled ? "text-active" : ""
                      } group flex w-full items-center rounded-md px-2 py-2`}
                    >
                      {valueDisplay ? valueDisplay(value) : (value as any).toString()}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

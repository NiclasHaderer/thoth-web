import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import React, { Fragment, ReactNode } from "react"

type DropdownProps<T> = {
  options: {
    value: T
    disabled?: boolean
  }[]
  title: ReactNode
  vDir?: "top" | "bottom"
  hDir?: "right" | "left"
  onChange?: (v: T) => void
  valueDisplay?: (v: T) => object
}

export function Dropdown<T>({
  options,
  title,
  vDir = "bottom",
  hDir = "left",
  onChange,
  valueDisplay,
}: DropdownProps<T>) {
  return (
    <Menu as="div" className="relative inline-block h-fit text-left">
      <MenuButton className="group cursor-pointer overflow-hidden rounded">
        <span className="h-full w-full p-1 group-hover:bg-active-light group-focus:bg-active-light">{title}</span>
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={`${hDir === "right" ? "right-0" : "left-0"} ${
            vDir === "top" ? "top-0 mb-2 -translate-y-full" : "mt-2"
          } absolute z-10 w-56 origin-top-right overflow-hidden rounded-md bg-surface`}
        >
          <div className="bg-elevate">
            <div className="px-1 py-1">
              {options.map(({ value, disabled }, i) => (
                <MenuItem key={i} disabled={disabled}>
                  {({ focus, disabled }) => (
                    <button
                      onClick={() => {
                        onChange && onChange(value)
                      }}
                      type="button"
                      disabled={disabled}
                      className={`${focus && !disabled ? "bg-active-light" : ""} ${
                        disabled ? "text-active" : ""
                      } group flex w-full items-center rounded-md px-2 py-2`}
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call */}
                      {valueDisplay ? valueDisplay(value) : (value as any).toString()}
                    </button>
                  )}
                </MenuItem>
              ))}
            </div>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}

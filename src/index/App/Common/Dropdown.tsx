import { Menu, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"

type DropdownProps<T extends any> = {
  options: {
    value: T
    disabled?: boolean
  }[]
  title: string
  active?: T
  changeTitle?: boolean
  vDir?: "top" | "bottom"
  hDir?: "right" | "left"
  onChange?: (v: T) => void
  valueDisplay?: (v: T) => string
}

export function Dropdown<T extends any>({
  vDir = "top",
  hDir = "left",
  options,
  onChange,
  changeTitle,
  active,
  title,
  valueDisplay,
}: DropdownProps<T>) {
  const [activeValue, setActiveValue] = useState(active)
  useEffect(() => {
    setActiveValue(active)
  }, [active])

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button>
        {changeTitle && activeValue
          ? valueDisplay
            ? valueDisplay(activeValue)
            : (activeValue as any).toString()
          : title}
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
          } absolute z-10 w-56 origin-top-right overflow-hidden rounded-md bg-background`}
        >
          <div className="bg-elevate">
            <div className="px-1 py-1">
              {options.map(({ value, disabled }, i) => (
                <Menu.Item
                  key={i}
                  disabled={disabled}
                  onClick={() => {
                    setActiveValue(value)
                    onChange && onChange(value)
                  }}
                >
                  {({ active, disabled }) => (
                    <button
                      type="button"
                      disabled={disabled}
                      className={`${active && !disabled ? "bg-light-active" : ""} ${
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

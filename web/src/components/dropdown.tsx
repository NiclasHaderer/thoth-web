import { ReactNode } from "react"
import { Button, MenuTrigger } from "react-aria-components"
import { DropdownMenu, DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"

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
  const placement = `${vDir === "top" ? "top" : "bottom"} ${hDir === "right" ? "end" : "start"}` as const

  return (
    <MenuTrigger>
      <Button className="group h-fit cursor-pointer overflow-hidden rounded outline-none">
        <span className="group-hover:bg-muted group-focus:bg-muted block h-full w-full p-1">{title}</span>
      </Button>
      <DropdownMenu placement={placement} className="w-56">
        {options.map(({ value, disabled }, i) => (
          <DropdownMenuItem key={i} isDisabled={disabled} onAction={() => onChange?.(value)}>
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call */}
            {valueDisplay ? (valueDisplay(value) as ReactNode) : (value as any).toString()}
          </DropdownMenuItem>
        ))}
      </DropdownMenu>
    </MenuTrigger>
  )
}

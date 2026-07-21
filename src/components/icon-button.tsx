import { forwardRef, ReactNode } from "react"
import { ColoredButton, ColoredButtonProps } from "@thoth/components/colored-button"

export interface IconButtonProps extends Omit<ColoredButtonProps, "children" | "aria-label"> {
  icon: ReactNode
  /** Required accessible name - icon buttons have no visible text. */
  label: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, color = "ghost", innerClassName, ...props }, ref) => (
    <ColoredButton ref={ref} color={color} aria-label={label} innerClassName={innerClassName ?? "p-2"} {...props}>
      <span aria-hidden="true" className="flex h-full w-full items-center justify-center">
        {icon}
      </span>
    </ColoredButton>
  )
)
IconButton.displayName = "IconButton"

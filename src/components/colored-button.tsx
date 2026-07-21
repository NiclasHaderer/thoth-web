import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react"

export interface ColoredButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  innerClassName?: string | undefined
  color?: "primary" | "secondary" | "ghost" | undefined
}

const COLOR_CLASS: Record<NonNullable<ColoredButtonProps["color"]>, string> = {
  primary:
    "bg-primary hover:brightness-110 active:brightness-90 focus-visible:ring-primary/60 focus-visible:ring-2 focus-visible:brightness-110",
  secondary:
    "bg-elevate hover:brightness-110 active:brightness-90 focus-visible:ring-primary/60 focus-visible:ring-2 focus-visible:brightness-110",
  ghost: "bg-transparent hover:bg-active focus-visible:bg-active",
}

export const ColoredButton = forwardRef<HTMLButtonElement, ColoredButtonProps>(
  ({ children, type = "button", innerClassName, color = "primary", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      {...props}
      className={`overflow-hidden rounded-md transition-[transform,filter,color,background-color] duration-100 outline-none active:scale-[0.97] ${COLOR_CLASS[color]} ${props.className || ""}`}
    >
      <div className={`flex h-full items-center ${innerClassName ?? "px-3 py-1"}`}>{children}</div>
    </button>
  )
)
ColoredButton.displayName = "ColoredButton"

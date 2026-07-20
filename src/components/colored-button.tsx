import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react"

export interface ColoredButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  innerClassName?: string | undefined
  color?: "primary" | "secondary" | undefined
}

export const ColoredButton: FC<ColoredButtonProps> = ({
  children,
  type = "button",
  innerClassName,
  color = "primary",
  ...props
}) => (
  <button
    type={type}
    {...props}
    className={`focus-visible:ring-primary/60 overflow-hidden rounded-md transition-[transform,filter] duration-100 outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:brightness-110 active:scale-[0.97] active:brightness-90 ${
      color === "primary" ? "bg-primary" : "bg-elevate"
    } ${props.className || ""}`}
  >
    <div className={`flex h-full items-center px-3 py-1 ${innerClassName || ""}`}>{children}</div>
  </button>
)

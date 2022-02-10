import React from "react"

export interface ColoredButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  innerClassName?: string | undefined
  color?: "primary" | "secondary" | undefined
}

export const ColoredButton: React.FC<ColoredButtonProps> = ({
  children,
  type = "button",
  innerClassName,
  color = "primary",
  ...props
}) => (
  <button
    type={type}
    {...props}
    className={`group overflow-hidden rounded-md ${color === "primary" ? "bg-primary" : "bg-elevate"} ${
      props.className || ""
    }`}
  >
    <div
      className={`flex h-full items-center px-3 py-1 hover:bg-light-active group-focus:bg-light-active ${
        innerClassName || ""
      }`}
    >
      {children}
    </div>
  </button>
)

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
      className={`flex h-full items-center px-3 py-1 hover:bg-active-light group-focus:bg-active-light ${
        innerClassName || ""
      }`}
    >
      {children}
    </div>
  </button>
)

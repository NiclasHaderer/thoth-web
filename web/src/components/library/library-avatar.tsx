import { cn } from "cn"
import { FC } from "react"

export const LibraryAvatar: FC<{ name: string; className?: string }> = ({ name, className }) => (
  <span
    aria-hidden
    className={cn(
      "bg-secondary text-secondary-foreground flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold select-none",
      className
    )}
  >
    {name.charAt(0).toUpperCase()}
  </span>
)

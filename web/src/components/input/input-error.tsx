import { FC } from "react"
import { cn } from "@thoth/lib/utils"

export type InputErrorProps = {
  errors?: string[] | string | null | undefined
  show?: boolean
  className?: string
}

export const InputError: FC<InputErrorProps> = ({ errors, show = true, className }) => {
  const messages = errors == null ? [] : Array.isArray(errors) ? errors : [errors]
  const visible = show && messages.length > 0

  // Zero-height anchor: the message is absolutely positioned so it never reserves
  // layout space, and content below doesn't shift when an error appears/disappears.
  return (
    <div className="relative">
      {visible ? (
        // overflow-hidden clips the slide-in so the message emerges from under the input.
        <div
          className={cn(
            "text-destructive absolute inset-x-0 top-0 flex items-center justify-end overflow-hidden",
            className
          )}
        >
          <span className="animate-slide-in-top truncate text-xs whitespace-nowrap">{messages.join(", ")}</span>
        </div>
      ) : null}
    </div>
  )
}

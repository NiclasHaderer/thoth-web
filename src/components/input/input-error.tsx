import { FC } from "react"

export type InputErrorProps = {
  errors?: string[] | string | null | undefined
  show?: boolean
  className?: string
}

export const InputError: FC<InputErrorProps> = ({ errors, show = true, className }) => {
  const messages = errors == null ? [] : Array.isArray(errors) ? errors : [errors]
  const visible = show && messages.length > 0

  return (
    <div className={`flex h-[1lh] items-center justify-end overflow-hidden ${className ?? ""}`}>
      {visible ? (
        <div className="animate-slide-in-top truncate whitespace-nowrap text-right text-sm text-error">
          {messages.join(", ")}
        </div>
      ) : null}
    </div>
  )
}

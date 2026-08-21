import { LucideIcon } from "lucide-react"
import { FC, ReactNode } from "react"
import { cn } from "@thoth/lib/utils"

export interface DetailFact {
  label: string
  value: ReactNode
}

export interface DetailLayoutProps {
  title: string
  image?: string
  fallbackIcon?: LucideIcon
  round?: boolean
  subtitle?: ReactNode
  credit?: ReactNode
  actions?: ReactNode
  facts?: DetailFact[]
  children?: ReactNode
}

export const detailLabel = "text-muted-foreground/70 text-[0.6875rem] font-medium tracking-[0.14em] uppercase"

export const entityLink =
  "text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"

export const DetailLayout: FC<DetailLayoutProps> = ({
  title,
  image,
  fallbackIcon: FallbackIcon,
  round,
  subtitle,
  credit,
  actions,
  facts,
  children,
}) => {
  const artShape = round ? "rounded-full" : "rounded-lg"
  const artSize = "w-[62%] max-w-56 shrink-0 sm:w-60 sm:max-w-none"

  return (
    <div className="mx-auto max-w-6xl min-w-0 pb-3">
      <header className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-9 sm:text-left">
        {image ? (
          <img
            className={cn("border-border border object-cover shadow-xl shadow-black/25", artShape, artSize)}
            alt={title}
            src={image}
          />
        ) : FallbackIcon ? (
          <div
            className={cn(
              "border-border text-muted-foreground/60 flex aspect-square items-center justify-center border",
              artShape,
              artSize
            )}
          >
            <FallbackIcon className="size-2/5" />
          </div>
        ) : null}

        <div className="flex w-full min-w-0 flex-col items-center gap-2 sm:flex-1 sm:items-start sm:pt-1">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>

          {subtitle ? (
            <div className="flex w-full flex-wrap items-center justify-center gap-x-3 text-lg sm:justify-start">
              {subtitle}
            </div>
          ) : null}

          {credit ? (
            <div className="text-muted-foreground flex w-full flex-wrap items-center justify-center gap-x-3 text-sm sm:justify-start">
              {credit}
            </div>
          ) : null}

          {actions ? (
            <div className="flex w-full flex-row-reverse flex-wrap items-center justify-center gap-3 pt-4 sm:w-auto sm:flex-row sm:justify-start [&>[data-slot=button]]:h-11 sm:[&>[data-slot=button]]:h-9">
              {actions}
            </div>
          ) : null}
        </div>
      </header>

      {facts && facts.length > 0 ? (
        <dl className="border-border mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t pt-7 text-left sm:grid-cols-3 lg:grid-cols-4">
          {facts.map(fact => (
            <div key={fact.label} className="min-w-0">
              <dt className={detailLabel}>{fact.label}</dt>
              <dd className="pt-2 text-sm">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="pt-12">{children}</div>
    </div>
  )
}

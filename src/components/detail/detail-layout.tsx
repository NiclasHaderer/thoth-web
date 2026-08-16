import { LucideIcon } from "lucide-react"
import { FC, Fragment, ReactNode } from "react"
import { cn } from "@thoth/lib/utils"

export interface DetailLayoutProps {
  title: string
  image?: string
  fallbackIcon: LucideIcon
  round?: boolean
  facts?: ReactNode[]
  details?: ReactNode
  actions?: ReactNode
  aside?: ReactNode
  children?: ReactNode
}

export const entityLink =
  "text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"

const Dot = () => <span aria-hidden className="bg-muted-foreground/50 size-1 shrink-0 rounded-full" />

export const DetailRail: FC<{ children: ReactNode }> = ({ children }) => (
  <dl className="border-border grid grid-cols-1 gap-5 border-t pt-6 sm:grid-cols-3 lg:grid-cols-1 lg:border-t-0 lg:pt-0">
    {children}
  </dl>
)

export const RailItem: FC<{ label: string; children: ReactNode; className?: string }> = ({
  label,
  children,
  className,
}) => (
  <div className={className}>
    <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</dt>
    <dd className="pt-1 text-sm">{children}</dd>
  </div>
)

export const DetailLayout: FC<DetailLayoutProps> = ({
  title,
  image,
  fallbackIcon: FallbackIcon,
  round,
  facts,
  details,
  actions,
  aside,
  children,
}) => {
  const artShape = round ? "rounded-full" : "rounded-lg"
  const artSize = "w-[62%] max-w-56 shrink-0 sm:w-52 sm:max-w-none"

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 pb-3 lg:flex-row lg:gap-12">
      <div className="min-w-0 grow">
        <div className="flex flex-col items-center gap-5 pb-8 text-center sm:flex-row sm:items-start sm:gap-8 sm:pb-10 sm:text-left">
          {image ? (
            <img className={cn("border-border border object-cover", artShape, artSize)} alt={title} src={image} />
          ) : (
            <div
              className={cn(
                "border-border text-muted-foreground flex aspect-square items-center justify-center border",
                artShape,
                artSize
              )}
            >
              <FallbackIcon className="size-2/5" />
            </div>
          )}

          <div className="flex w-full min-w-0 flex-col items-center gap-2 sm:w-auto sm:items-start">
            <h1 className="text-3xl font-semibold text-balance">{title}</h1>

            {facts && facts.length > 0 ? (
              <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-2 text-sm sm:justify-start">
                {facts.map((fact, index) => (
                  <Fragment key={index}>
                    {index > 0 ? <Dot /> : null}
                    {fact}
                  </Fragment>
                ))}
              </div>
            ) : null}

            {details}

            {actions ? (
              <div className="flex w-full flex-row-reverse flex-wrap items-center justify-center gap-3 pt-2 sm:w-auto sm:flex-row sm:justify-start [&>[data-slot=button]]:h-11 sm:[&>[data-slot=button]]:h-8">
                {actions}
              </div>
            ) : null}
          </div>
        </div>

        {children}
      </div>

      {aside ? <aside className="lg:w-56 lg:shrink-0">{aside}</aside> : null}
    </div>
  )
}

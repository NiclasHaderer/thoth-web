import { ChevronDownIcon, LucideIcon } from "lucide-react"
import { motion } from "motion/react"
import { FC, ReactNode, useState } from "react"
import { useBreakpoint } from "@thoth/hooks/use-media-query"
import { cn } from "@thoth/lib/utils"

export interface DetailLayoutProps {
  title: string
  image?: string
  fallbackIcon?: LucideIcon
  round?: boolean
  subtitle?: ReactNode
  credit?: ReactNode
  body?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}

export const detailLabel = "text-muted-foreground/70 text-[0.6875rem] font-medium tracking-[0.14em] uppercase"

export const entityLink =
  "text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"

const ArtFrame: FC<{ expanded: boolean; onClick?: () => void; children: ReactNode }> = ({
  expanded,
  onClick,
  children,
}) => {
  const frame = (
    <motion.div
      initial={false}
      animate={{ width: expanded ? "13rem" : "10rem" }}
      transition={{ type: "spring", stiffness: 260, damping: 17, mass: 0.9 }}
    >
      {children}
    </motion.div>
  )

  if (!onClick) return frame

  return (
    <button type="button" aria-expanded={expanded} onClick={onClick} className="rounded-lg outline-none">
      {frame}
    </button>
  )
}

export interface MobileDetailHeaderProps {
  title: string
  backdrop?: string
  art?: ReactNode
  stats?: ReactNode
  revealTop?: ReactNode
  revealBottom?: ReactNode
  actions?: ReactNode
}

export const MobileDetailHeader: FC<MobileDetailHeaderProps> = ({
  title,
  backdrop,
  art,
  stats,
  revealTop,
  revealBottom,
  actions,
}) => {
  const [expanded, setExpanded] = useState(true)
  const collapsible = Boolean(revealTop || revealBottom)
  const toggle = () => setExpanded(open => !open)

  const reveal = {
    initial: false,
    animate: { height: expanded ? ("auto" as const) : 0, opacity: expanded ? 1 : 0 },
    transition: { duration: 0.25, ease: "easeInOut" as const },
    className: "w-full overflow-hidden",
  }

  return (
    <div className="relative">
      {backdrop ? (
        <div aria-hidden className="pointer-events-none absolute -inset-x-5 -top-24 h-96 overflow-hidden">
          <img
            src={backdrop}
            alt=""
            className="h-full w-full scale-125 object-cover opacity-45 blur-3xl saturate-150"
          />
          <div className="to-background absolute inset-0 bg-gradient-to-b from-transparent" />
        </div>
      ) : null}

      <div className="relative flex flex-col items-center gap-3 text-center">
        {art ? (
          <ArtFrame expanded={!collapsible || expanded} onClick={collapsible ? toggle : undefined}>
            {art}
          </ArtFrame>
        ) : null}

        <div className="flex w-full flex-col items-center">
          {revealTop ? <motion.div {...reveal}>{revealTop}</motion.div> : null}

          {collapsible ? (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={toggle}
              className="flex max-w-full items-center gap-1.5 rounded-lg outline-none"
            >
              <h1 className="min-w-0 text-xl font-bold tracking-tight text-balance">{title}</h1>
              <ChevronDownIcon
                aria-hidden
                className={cn("size-5 shrink-0 transition-transform duration-300", expanded && "rotate-180")}
              />
            </button>
          ) : (
            <h1 className="min-w-0 text-xl font-bold tracking-tight text-balance">{title}</h1>
          )}
        </div>

        {stats ? (
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm">
            {stats}
          </div>
        ) : null}

        {actions ? <div className="flex w-full items-center justify-center gap-1.5">{actions}</div> : null}
      </div>

      {revealBottom ? <motion.div {...reveal}>{revealBottom}</motion.div> : null}
    </div>
  )
}

export const DetailLayout: FC<DetailLayoutProps> = ({
  title,
  image,
  fallbackIcon: FallbackIcon,
  round,
  subtitle,
  credit,
  body,
  actions,
  children,
}) => {
  const isDesktop = useBreakpoint("md")
  const artShape = round ? "rounded-full" : "rounded-lg"
  const artSize = "w-60 shrink-0"

  const art = (sizeClass: string) =>
    image ? (
      <img
        className={cn(
          "border-border border object-cover shadow-xl shadow-black/25",
          round && "aspect-square",
          artShape,
          sizeClass
        )}
        alt={title}
        src={image}
      />
    ) : FallbackIcon ? (
      <div
        className={cn(
          "border-border text-muted-foreground/60 flex aspect-square items-center justify-center border",
          artShape,
          sizeClass
        )}
      >
        <FallbackIcon className="size-2/5" />
      </div>
    ) : null

  if (!isDesktop) {
    return (
      <div className="mx-auto max-w-6xl min-w-0">
        <MobileDetailHeader
          title={title}
          backdrop={image}
          art={art("w-full")}
          stats={
            <>
              {subtitle ? (
                <div className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1.5">{subtitle}</div>
              ) : null}
              {credit ? (
                <div className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1.5">{credit}</div>
              ) : null}
            </>
          }
          actions={
            actions ? (
              <div className="flex w-full items-center gap-1.5 [&_[data-slot=button]_span]:not-sr-only [&>[data-slot=button]]:h-11 [&>[data-slot=button]]:w-auto [&>[data-slot=button]]:grow [&>[data-slot=button]]:px-5">
                {actions}
              </div>
            ) : null
          }
        />

        {body ? <div className="pt-6">{body}</div> : null}

        <div className="pt-8">{children}</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl min-w-0">
      <header className="flex items-start gap-9">
        {art(artSize)}

        <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
          <div className="flex w-full items-start justify-between gap-4">
            <h1 className="min-w-0 text-4xl font-semibold tracking-tight text-balance">{title}</h1>

            {actions ? (
              <div className="flex shrink-0 items-center gap-1.5 pt-1 [&>[data-slot=button]]:h-9">{actions}</div>
            ) : null}
          </div>

          {subtitle ? <div className="flex w-full flex-wrap items-center gap-x-3 text-lg">{subtitle}</div> : null}

          {credit ? (
            <div className="text-muted-foreground border-border/60 mt-1 flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 border-t pt-3 text-sm">
              {credit}
            </div>
          ) : null}

          {body ? <div className="w-full max-w-3xl pt-4">{body}</div> : null}
        </div>
      </header>

      <div className="pt-12">{children}</div>
    </div>
  )
}

import { FC } from "react"
import { RESPONSIVE_GRID } from "@thoth/components/responsive-grid"
import { Skeleton } from "@thoth/components/ui/skeleton"
import { cn } from "@thoth/lib/utils"
import { getSizing } from "@thoth/utils/responsive-sizing"

export const PreviewSkeleton: FC<{
  round?: boolean
  subtitle?: boolean
  size?: "small" | "normal"
  className?: string
}> = ({ round, subtitle, size = "normal", className }) => {
  const { containerClasses, widthClasses, heightClasses } = getSizing(size)
  return (
    <div className={cn(containerClasses, className)}>
      <Skeleton className={cn(widthClasses, heightClasses, round ? "rounded-full" : "rounded-xl")} />
      <div className="pt-2 text-sm leading-tight">
        <Skeleton className={cn("h-[1.25em] w-3/4", round && "mx-auto")} />
      </div>
      {subtitle ? (
        <div className="pt-0.5 text-xs leading-tight">
          <Skeleton className={cn("h-[1.25em] w-1/2", round && "mx-auto")} />
        </div>
      ) : null}
    </div>
  )
}

export const PreviewGridSkeleton: FC<{ count?: number; round?: boolean; subtitle?: boolean }> = ({
  count = 6,
  round,
  subtitle,
}) => (
  <div className={RESPONSIVE_GRID}>
    {Array.from({ length: count }, (_, index) => (
      <PreviewSkeleton key={index} round={round} subtitle={subtitle} />
    ))}
  </div>
)

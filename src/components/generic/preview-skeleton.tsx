import { FC } from "react"
import { Skeleton } from "@thoth/components/ui/skeleton"
import { cn } from "@thoth/lib/utils"

// Mirrors the box model of GenericPreview line for line
export const PreviewSkeleton: FC<{ round?: boolean; subtitle?: boolean }> = ({ round, subtitle }) => (
  <div className="block w-full">
    <Skeleton className={cn("aspect-square w-full", round ? "rounded-full" : "rounded-xl")} />
    <div className="pt-2 text-sm leading-tight">
      <Skeleton className="h-[1.25em] w-3/4" />
    </div>
    {subtitle ? (
      <div className="pt-0.5 text-xs leading-tight">
        <Skeleton className="h-[1.25em] w-1/2" />
      </div>
    ) : null}
  </div>
)

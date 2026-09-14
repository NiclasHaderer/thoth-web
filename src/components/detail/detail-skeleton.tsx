import { FC, ReactNode } from "react"
import { Skeleton } from "@thoth/components/ui/skeleton"
import { useBreakpoint } from "@thoth/hooks/use-media-query"
import { cn } from "@thoth/lib/utils"

export const DetailSkeleton: FC<{ round?: boolean; children?: ReactNode }> = ({ round, children }) => {
  const isDesktop = useBreakpoint("md")
  const artShape = round ? "rounded-full" : "rounded-lg"

  if (!isDesktop) {
    return (
      <div className="mx-auto max-w-6xl min-w-0">
        <div className="flex flex-col items-center gap-3 text-center">
          <Skeleton className={cn("aspect-square w-52", artShape)} />
          <Skeleton className="h-[1lh] w-2/3 text-xl" />
          <Skeleton className="h-[1lh] w-1/3 text-sm" />
        </div>
        <div className="pt-8">{children}</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl min-w-0">
      <header className="flex items-start gap-9">
        <Skeleton className={cn("aspect-square w-60 shrink-0", artShape)} />
        <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
          <Skeleton className="h-[1lh] w-2/3 text-4xl" />
          <Skeleton className="h-[1lh] w-1/3 text-lg" />
          <div className="border-border/60 mt-1 border-t pt-3">
            <Skeleton className="h-[1lh] w-1/4 text-sm" />
          </div>
        </div>
      </header>
      <div className="pt-12">{children}</div>
    </div>
  )
}

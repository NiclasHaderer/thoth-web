import { FC, ReactNode } from "react"
import { Sheet, SheetHeader, SheetTitle } from "@thoth/components/ui/sheet"
import { useSwipeDismiss } from "@thoth/hooks/swipe-dismiss"

export const BottomSheet: FC<{ title: string; onDismiss: () => void; children: ReactNode }> = ({
  title,
  onDismiss,
  children,
}) => {
  const swipeRef = useSwipeDismiss(onDismiss)

  return (
    <Sheet side="bottom" showCloseButton={false} className="gap-0 rounded-t-xl pb-[env(safe-area-inset-bottom)]">
      <div aria-hidden ref={swipeRef} className="flex shrink-0 justify-center pt-2.5">
        <span className="bg-muted-foreground/40 h-1 w-10 rounded-full" />
      </div>
      <SheetHeader className="pt-3 pb-3">
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
      {children}
    </Sheet>
  )
}

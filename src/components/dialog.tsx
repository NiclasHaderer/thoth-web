import { FC, ReactNode } from "react"
import { Dialog as UIDialog, DialogHeader, DialogTitle } from "@thoth/components/ui/dialog"
import { cn } from "@thoth/lib/utils"

export const Dialog: FC<{
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  className?: string
  children: ReactNode
}> = ({ isOpen, onOpenChange, title, className, children }) => (
  <UIDialog isOpen={isOpen} onOpenChange={onOpenChange} className={cn("sm:max-w-2xl", className)}>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
    <div className="min-w-0">{children}</div>
  </UIDialog>
)

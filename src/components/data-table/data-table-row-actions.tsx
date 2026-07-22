import { MoreHorizontalIcon } from "lucide-react"
import { ReactNode } from "react"
import { MenuTrigger } from "react-aria-components"
import { Button } from "@thoth/components/ui/button"
import { DropdownMenu } from "@thoth/components/ui/dropdown-menu"
import { cn } from "@thoth/lib/utils"

interface DataTableRowActionsProps {
  /** DropdownMenuItem elements. */
  children: ReactNode
  className?: string
}

export function DataTableRowActions({ children, className }: DataTableRowActionsProps) {
  return (
    // Stop row-click handlers from firing when interacting with the menu.
    <div className={cn("flex", className)} onClick={e => e.stopPropagation()}>
      <MenuTrigger>
        <Button variant="ghost" size="icon" className="data-open:bg-muted size-8" aria-label="Open row actions">
          <MoreHorizontalIcon />
        </Button>
        <DropdownMenu placement="bottom end" className="w-40">
          {children}
        </DropdownMenu>
      </MenuTrigger>
    </div>
  )
}

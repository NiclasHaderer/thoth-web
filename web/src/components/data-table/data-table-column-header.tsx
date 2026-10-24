import { Column } from "@tanstack/react-table"
import { cn } from "cn"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, EyeOffIcon } from "lucide-react"
import { MenuTrigger } from "react-aria-components"
import { Button } from "@dewey/components/ui/button"
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "@dewey/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>
  }

  const sorted = column.getIsSorted()

  return (
    <div className={cn("flex items-center", className)}>
      <MenuTrigger>
        <Button variant="ghost" size="sm" className="data-open:bg-accent -ml-2.5 h-8">
          <span>{title}</span>
          {sorted === "desc" ? <ArrowDownIcon /> : sorted === "asc" ? <ArrowUpIcon /> : <ChevronsUpDownIcon />}
        </Button>
        <DropdownMenu placement="bottom start" className="w-auto min-w-32">
          <DropdownMenuItem onAction={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="text-muted-foreground" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onAction={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="text-muted-foreground" />
            Desc
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onAction={() => column.toggleVisibility(false)}>
                <EyeOffIcon className="text-muted-foreground" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenu>
      </MenuTrigger>
    </div>
  )
}

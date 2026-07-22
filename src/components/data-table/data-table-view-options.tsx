import { Table } from "@tanstack/react-table"
import { Settings2Icon } from "lucide-react"
import { Key, MenuTrigger, Selection } from "react-aria-components"
import { Button } from "@thoth/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@thoth/components/ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  const columns = table.getAllColumns().filter(c => typeof c.accessorFn !== "undefined" && c.getCanHide())
  const visibleKeys = new Set<Key>(columns.filter(c => c.getIsVisible()).map(c => c.id))

  const onSelectionChange = (keys: Selection) => {
    const selected = keys === "all" ? new Set(columns.map(c => c.id)) : keys
    if (selected.size === 0) return // keep at least one column visible
    columns.forEach(c => c.toggleVisibility(selected.has(c.id)))
  }

  return (
    <MenuTrigger>
      <Button variant="outline" size="sm" className="ml-auto flex h-8" aria-label="View options">
        <Settings2Icon />
        <span className="hidden sm:inline">View</span>
      </Button>
      <DropdownMenu
        placement="bottom end"
        className="w-auto min-w-40"
        selectionMode="multiple"
        selectedKeys={visibleKeys}
        onSelectionChange={onSelectionChange}
      >
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map(column => (
          <DropdownMenuItem key={column.id} id={column.id} className="whitespace-nowrap capitalize">
            {typeof column.columnDef.meta === "object" && column.columnDef.meta && "label" in column.columnDef.meta
              ? String((column.columnDef.meta as { label?: string }).label)
              : column.id}
          </DropdownMenuItem>
        ))}
      </DropdownMenu>
    </MenuTrigger>
  )
}

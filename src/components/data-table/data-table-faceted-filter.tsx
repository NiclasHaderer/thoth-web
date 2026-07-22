import { Column } from "@tanstack/react-table"
import { PlusCircleIcon } from "lucide-react"
import { ComponentType } from "react"
import { MenuTrigger, Selection } from "react-aria-components"
import { Badge } from "@thoth/components/ui/badge"
import { Button } from "@thoth/components/ui/button"
import { DropdownMenu, DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: { label: string; value: string; icon?: ComponentType<{ className?: string }> }[]
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set((column?.getFilterValue() as string[]) ?? [])

  const onSelectionChange = (keys: Selection) => {
    const next = keys === "all" ? options.map(o => o.value) : Array.from(keys).map(String)
    column?.setFilterValue(next.length ? next : undefined)
  }

  return (
    <MenuTrigger>
      <Button variant="outline" size="sm" className="h-8 border-dashed">
        <PlusCircleIcon />
        {title}
        {selectedValues.size > 0 && (
          <>
            <span className="bg-border mx-0.5 h-4 w-px" />
            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
              {selectedValues.size}
            </Badge>
            <div className="hidden gap-1 lg:flex">
              {selectedValues.size > 2 ? (
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {selectedValues.size} selected
                </Badge>
              ) : (
                options
                  .filter(o => selectedValues.has(o.value))
                  .map(o => (
                    <Badge variant="secondary" key={o.value} className="rounded-sm px-1 font-normal">
                      {o.label}
                    </Badge>
                  ))
              )}
            </div>
          </>
        )}
      </Button>
      <DropdownMenu
        placement="bottom start"
        className="w-52"
        selectionMode="multiple"
        selectedKeys={selectedValues}
        onSelectionChange={onSelectionChange}
      >
        {options.map(option => {
          const Icon = option.icon
          return (
            <DropdownMenuItem key={option.value} id={option.value}>
              {Icon && <Icon className="text-muted-foreground" />}
              <span>{option.label}</span>
              {facets?.get(option.value) !== undefined && (
                <span className="text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs">
                  {facets.get(option.value)}
                </span>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenu>
    </MenuTrigger>
  )
}

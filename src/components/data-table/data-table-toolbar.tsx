import { Table } from "@tanstack/react-table"
import { XIcon } from "lucide-react"
import { ComponentType, ReactNode } from "react"
import { DataTableFacetedFilter } from "@thoth/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@thoth/components/data-table/data-table-view-options"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@thoth/components/ui/input-group"

interface FacetFilter {
  columnId: string
  title: string
  options: { label: string; value: string; icon?: ComponentType<{ className?: string }> }[]
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumnId?: string
  searchPlaceholder?: string
  filters?: FacetFilter[]
  /** Extra controls rendered on the right, before the view options. */
  children?: ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchColumnId,
  searchPlaceholder = "Filter...",
  filters = [],
  children,
}: DataTableToolbarProps<TData>) {
  const searchColumn = searchColumnId ? table.getColumn(searchColumnId) : undefined
  const searchValue = (searchColumn?.getFilterValue() as string) ?? ""

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {searchColumn && (
          <InputGroup className="min-w-40 flex-1">
            <InputGroupInput
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={e => searchColumn.setFilterValue(e.target.value)}
            />
            {searchValue && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Clear search"
                  onPress={() => searchColumn.setFilterValue(undefined)}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        )}
        {filters.map(filter => (
          <DataTableFacetedFilter
            key={filter.columnId}
            column={table.getColumn(filter.columnId)}
            title={filter.title}
            options={filter.options}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        {children}
      </div>
    </div>
  )
}

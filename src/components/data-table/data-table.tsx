import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  Table as TanstackTable,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ReactNode, useState } from "react"
import { cn } from "@thoth/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Rendered above the table. Receives the table instance so it can drive search/filters/view-options. */
  toolbar?: (table: TanstackTable<TData>) => ReactNode
  /** Called when a body row is clicked (skips clicks originating from interactive cell content). */
  onRowClick?: (row: TData) => void
  emptyState?: ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  toolbar,
  onRowClick,
  emptyState = "No results.",
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table manages its own mutable instance
    state: { sorting, columnVisibility, rowSelection, columnFilters },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {toolbar?.(table)}
      <div className="relative min-h-0 w-full flex-1 overflow-auto rounded-lg border">
        <table className="w-full caption-bottom text-sm">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-card">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-muted-foreground bg-card sticky top-0 z-10 h-10 border-b px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(
                    "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors last:border-0",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-muted-foreground h-24 text-center align-middle">
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

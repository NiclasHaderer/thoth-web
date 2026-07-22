import { Table } from "@tanstack/react-table"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react"
import { Button } from "@thoth/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@thoth/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const totalCount = table.getFilteredRowModel().rows.length

  return (
    <div className="flex items-center justify-between px-1">
      <div className="text-muted-foreground hidden flex-1 text-sm sm:block">
        {selectedCount > 0 && `${selectedCount} of ${totalCount} row(s) selected.`}
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 sm:flex-none sm:justify-normal sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select
            aria-label="Rows per page"
            selectedKey={String(table.getState().pagination.pageSize)}
            onSelectionChange={key => table.setPageSize(Number(key))}
          >
            <SelectTrigger size="sm" className="w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} id={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm font-medium whitespace-nowrap">
          <span className="hidden sm:inline">Page </span>
          {table.getState().pagination.pageIndex + 1}
          <span className="sm:hidden"> / </span>
          <span className="hidden sm:inline"> of </span>
          {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Go to first page"
            isDisabled={!table.getCanPreviousPage()}
            onPress={() => table.setPageIndex(0)}
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Go to previous page"
            isDisabled={!table.getCanPreviousPage()}
            onPress={() => table.previousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Go to next page"
            isDisabled={!table.getCanNextPage()}
            onPress={() => table.nextPage()}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Go to last page"
            isDisabled={!table.getCanNextPage()}
            onPress={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

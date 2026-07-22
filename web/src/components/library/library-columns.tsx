import { ColumnDef } from "@tanstack/react-table"
import { PencilIcon } from "lucide-react"
import { Library } from "@thoth/client"
import { DataTableColumnHeader } from "@thoth/components/data-table/data-table-column-header"
import { DataTableRowActions } from "@thoth/components/data-table/data-table-row-actions"
import { DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"

interface LibraryColumnsOptions {
  onEdit: (library: Library) => void
}

export const libraryColumns = ({ onEdit }: LibraryColumnsOptions): ColumnDef<Library>[] => [
  {
    accessorKey: "name",
    meta: { label: "Library" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Library" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    id: "preferEmbeddedMetadata",
    accessorFn: row => (row.preferEmbeddedMetadata ? "Embedded" : "External"),
    meta: { label: "Metadata preference" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Metadata preference" />,
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  {
    id: "metadataScanners",
    accessorFn: row => row.metadataScanners.map(s => s.name).join(", "),
    meta: { label: "Metadata scanners" },
    header: "Metadata scanners",
    enableSorting: false,
  },
  {
    id: "fileScanners",
    accessorFn: row => row.fileScanners.map(s => s.name).join(", "),
    meta: { label: "File scanners" },
    header: "File scanners",
    enableSorting: false,
  },
  {
    accessorKey: "language",
    meta: { label: "Language" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Language" />,
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions className="justify-end">
        <DropdownMenuItem onAction={() => onEdit(row.original)}>
          <PencilIcon className="text-muted-foreground" />
          Edit
        </DropdownMenuItem>
        {/* TODO: add a Delete action once the backend exposes a delete-library route.
            The DELETE /libraries/{id} route is annotated in Api.kt but not implemented
            (no handler in Library.kt, no LibraryRepository.delete), so it's absent from
            the generated client. Wire it here after the backend + client regen land. */}
      </DataTableRowActions>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]

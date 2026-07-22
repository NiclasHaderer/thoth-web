import { ColumnDef } from "@tanstack/react-table"
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { ThothUserWithPermissions, UserPermissions } from "@thoth/client"
import { DataTableColumnHeader } from "@thoth/components/data-table/data-table-column-header"
import { DataTableRowActions } from "@thoth/components/data-table/data-table-row-actions"
import { Badge } from "@thoth/components/ui/badge"
import { DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"

export type UserRow = ThothUserWithPermissions<UserPermissions>

interface UserColumnsOptions {
  currentUserId: string | undefined
  onEdit: (user: UserRow) => void
  onDelete: (user: UserRow) => void
}

export const userColumns = ({ currentUserId, onEdit, onDelete }: UserColumnsOptions): ColumnDef<UserRow>[] => [
  {
    accessorKey: "username",
    meta: { label: "Username" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    cell: ({ row }) => <span className="font-medium">{row.original.username}</span>,
  },
  {
    id: "role",
    accessorFn: row => (row.permissions.isAdmin ? "Admin" : "User"),
    meta: { label: "Role" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
  },
  {
    id: "libraries",
    accessorFn: row => row.permissions.libraries.map(l => `${l.name} (${l.permissions})`).join(", "),
    meta: { label: "Libraries" },
    header: "Libraries",
    enableSorting: false,
    cell: ({ row }) => {
      const libs = row.original.permissions.libraries
      if (libs.length === 0) return <span className="text-muted-foreground">None</span>
      const MAX = 3
      const shown = libs.slice(0, MAX)
      const rest = libs.slice(MAX)
      return (
        <div className="flex items-center gap-1">
          {shown.map(l => (
            <Badge
              key={l.id}
              variant="secondary"
              title={`${l.name} (${l.permissions === "READ_WRITE" ? "Read & write" : "Read only"})`}
              className="max-w-40 truncate"
            >
              {l.permissions === "READ_WRITE" ? (
                <PencilIcon className="text-muted-foreground" />
              ) : (
                <EyeIcon className="text-muted-foreground" />
              )}
              {l.name}
            </Badge>
          ))}
          {rest.length > 0 && (
            <Badge variant="outline" title={rest.map(l => `${l.name} (${l.permissions})`).join(", ")}>
              +{rest.length}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions className="justify-end">
        <DropdownMenuItem onAction={() => onEdit(row.original)}>
          <PencilIcon className="text-muted-foreground" />
          Edit
        </DropdownMenuItem>
        {currentUserId !== row.original.id && (
          <DropdownMenuItem variant="destructive" onAction={() => onDelete(row.original)}>
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        )}
      </DataTableRowActions>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]

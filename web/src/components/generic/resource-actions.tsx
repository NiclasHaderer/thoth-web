import { cn } from "cn"
import { LoaderCircleIcon, MoreVerticalIcon, PencilIcon, WandSparklesIcon } from "lucide-react"
import { ComponentProps, FC, ReactNode } from "react"
import { MenuTrigger, Pressable } from "react-aria-components"
import { toast } from "sonner"
import { UUID } from "@dewey/client"
import { Button } from "@dewey/components/ui/button"
import { ContextMenu, ContextMenuTrigger } from "@dewey/components/ui/context-menu"
import { DropdownMenu, DropdownMenuItem } from "@dewey/components/ui/dropdown-menu"

export const menuItem = "gap-2.5 rounded-lg px-2.5 py-2 text-sm"

interface AutoMatchMutation {
  mutateAsync: (variables: { libraryId: UUID; id: UUID }) => Promise<unknown>
  isPending: boolean
}

export interface ResourceMenuProps {
  libraryId: UUID
  id: UUID
  label: string
  autoMatch: AutoMatchMutation
  onEdit?: () => void
  leading?: ReactNode
  children?: ReactNode
}

const ResourceMenuItems: FC<ResourceMenuProps> = ({ libraryId, id, label, autoMatch, onEdit, leading, children }) => (
  <>
    {leading}
    {onEdit ? (
      <DropdownMenuItem className={menuItem} onAction={onEdit}>
        <PencilIcon className="text-muted-foreground size-5" />
        Edit
      </DropdownMenuItem>
    ) : null}
    <DropdownMenuItem
      className={menuItem}
      isDisabled={autoMatch.isPending}
      onAction={() => {
        autoMatch
          .mutateAsync({ libraryId, id })
          .then(() => toast.success(`Matched ${label} metadata`))
          .catch(() => {})
      }}
    >
      <WandSparklesIcon className="text-muted-foreground size-5" />
      Auto match
    </DropdownMenuItem>
    {children}
  </>
)

export const ResourceActions: FC<
  ResourceMenuProps & {
    triggerClassName?: string
    placement?: ComponentProps<typeof DropdownMenu>["placement"]
  }
> = ({ triggerClassName, placement = "bottom end", ...menu }) => (
  <MenuTrigger>
    <Button
      variant="ghost"
      size="icon-lg"
      aria-label={`More ${menu.label} actions`}
      className={cn(
        "text-muted-foreground hover:text-foreground aspect-square h-11 w-auto! shrink-0 grow-0! rounded-full px-0! sm:h-10",
        triggerClassName
      )}
    >
      {menu.autoMatch.isPending ? (
        <LoaderCircleIcon className="size-5 animate-spin" />
      ) : (
        <MoreVerticalIcon className="size-5" />
      )}
    </Button>
    <DropdownMenu placement={placement} className="w-48">
      <ResourceMenuItems {...menu} />
    </DropdownMenu>
  </MenuTrigger>
)

// Opens the same menu at the pointer on right-click or long press. The target must be focusable with an interactive
// role (a link or button), which React Aria's Pressable requires.
export type ContextMenuTarget = ComponentProps<typeof Pressable>["children"]

export const ResourceContextMenu: FC<ResourceMenuProps & { target: ContextMenuTarget }> = ({ target, ...menu }) => (
  <ContextMenuTrigger>
    <Pressable>{target}</Pressable>
    <ContextMenu className="w-48">
      <ResourceMenuItems {...menu} />
    </ContextMenu>
  </ContextMenuTrigger>
)

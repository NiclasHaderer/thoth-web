import { cn } from "cn"
import { LoaderCircleIcon, MoreVerticalIcon, PencilIcon, WandSparklesIcon } from "lucide-react"
import { ComponentProps, FC, ReactNode } from "react"
import { MenuTrigger } from "react-aria-components"
import { toast } from "sonner"
import { UUID } from "@thoth/client"
import { Button } from "@thoth/components/ui/button"
import { DropdownMenu, DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"

export const menuItem = "gap-2.5 rounded-lg px-2.5 py-2 text-sm"

interface AutoMatchMutation {
  mutateAsync: (variables: { libraryId: UUID; id: UUID }) => Promise<unknown>
  isPending: boolean
}

export const ResourceActions: FC<{
  libraryId: UUID
  id: UUID
  label: string
  autoMatch: AutoMatchMutation
  onEdit?: () => void
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  triggerClassName?: string
  placement?: ComponentProps<typeof DropdownMenu>["placement"]
  leading?: ReactNode
  children?: ReactNode
}> = ({
  libraryId,
  id,
  label,
  autoMatch,
  onEdit,
  isOpen,
  onOpenChange,
  triggerClassName,
  placement = "bottom end",
  leading,
  children,
}) => (
  <MenuTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
    <Button
      variant="ghost"
      size="icon-lg"
      aria-label={`More ${label} actions`}
      className={cn(
        "text-muted-foreground hover:text-foreground aspect-square h-11 w-auto! shrink-0 grow-0! rounded-full px-0! sm:h-10",
        triggerClassName
      )}
    >
      {autoMatch.isPending ? (
        <LoaderCircleIcon className="size-5 animate-spin" />
      ) : (
        <MoreVerticalIcon className="size-5" />
      )}
    </Button>
    <DropdownMenu placement={placement} className="w-48">
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
    </DropdownMenu>
  </MenuTrigger>
)

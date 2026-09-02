import { PlusIcon, CheckIcon, XIcon, FolderIcon } from "lucide-react"
import { FC, useState } from "react"
import { InputError } from "@thoth/components/input/input-error"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@thoth/components/ui/breadcrumb"
import { Button } from "@thoth/components/ui/button"
import { ButtonGroup } from "@thoth/components/ui/button-group"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@thoth/components/ui/dropdown-menu"
import { useFolders } from "@thoth/queries/system"

export const FolderManager: FC<{
  onSelectFolder?: (path: string) => void
  onRemoveFolder?: (path: string) => void
  contentClassName?: string
  className?: string
  errors: string[] | undefined
  selectedFolders?: string[]
}> = ({ onSelectFolder, onRemoveFolder, contentClassName, className, errors, selectedFolders }) => {
  const [currentPath, setCurrentPath] = useState("/")
  const { data: folders } = useFolders(currentPath)

  const selected = new Set(selectedFolders ?? [])

  const segments = currentPath.split("/").filter(path => path !== "")
  const pathAt = (index: number) => "/" + segments.slice(0, index + 1).join("/")
  const MAX_TRAILING = 2
  const collapse = segments.length > MAX_TRAILING
  const trailingStart = collapse ? segments.length - MAX_TRAILING : 0
  const collapsed = segments.slice(0, trailingStart)
  const trailing = segments.slice(trailingStart)

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <Breadcrumb className="max-w-full overflow-hidden p-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Button variant="ghost" size="icon-sm" aria-label="Go to root folder" onPress={() => setCurrentPath("/")}>
              /
            </Button>
          </BreadcrumbItem>
          {collapse && (
            <BreadcrumbItem>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon-sm" aria-label="Show collapsed folders">
                  <BreadcrumbEllipsis />
                </Button>
                <DropdownMenu placement="bottom start">
                  {collapsed.map((path, index) => (
                    <DropdownMenuItem key={index} onAction={() => setCurrentPath(pathAt(index))}>
                      {path}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenu>
              </DropdownMenuTrigger>
            </BreadcrumbItem>
          )}
          {trailing.map((path, index) => {
            const realIndex = trailingStart + index
            const isLast = realIndex === segments.length - 1
            return (
              <BreadcrumbItem key={realIndex}>
                {isLast ? (
                  <BreadcrumbPage>{path}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink onPress={() => setCurrentPath(pathAt(realIndex))}>{path}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div tabIndex={-1} className={`flex flex-col py-1 pr-2 pl-1 ${contentClassName ?? ""}`}>
        {folders?.length === 0 && <div className="p-2 text-sm opacity-60">No subfolders</div>}
        {folders?.map(folder => {
          const added = selected.has(folder.path)
          return (
            <ButtonGroup key={folder.path} className="w-full">
              <Button
                variant="ghost"
                onPress={() => setCurrentPath(folder.path)}
                aria-label={`Open folder ${folder.name}`}
                className="grow justify-start overflow-hidden"
              >
                <FolderIcon className="shrink-0" aria-hidden />
                <span className="truncate">{folder.name}</span>
              </Button>
              {added ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="group text-primary hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove folder ${folder.name}`}
                  onPress={() => onRemoveFolder?.(folder.path)}
                >
                  <CheckIcon className="group-hover:hidden" aria-hidden />
                  <XIcon className="hidden group-hover:block" aria-hidden />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Add folder ${folder.name}`}
                  onPress={() => onSelectFolder?.(folder.path)}
                >
                  <PlusIcon />
                </Button>
              )}
            </ButtonGroup>
          )
        })}
      </div>
      <InputError errors={errors} className="justify-start" />
    </div>
  )
}

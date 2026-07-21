import { FC, useEffect, useState } from "react"
import { MdAdd, MdCheck, MdFolder, MdHome } from "react-icons/md"
import { Api } from "@thoth/client"
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
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@thoth/components/ui/dropdown-menu"
import { useHttpRequest } from "@thoth/hooks/async-response"

export const FolderManager: FC<{
  onSelectFolder?: (path: string) => void
  contentClassName?: string
  className?: string
  errors: string[] | undefined
  selectedFolders?: string[]
}> = ({ onSelectFolder, contentClassName, className, errors, selectedFolders }) => {
  const [currentPath, setCurrentPath] = useState("/")
  const folders = useHttpRequest(Api.listFoldersAtACertainPath)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void folders.invoke({ path: currentPath }), [currentPath])

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
              <MdHome className="size-4" />
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
      <div tabIndex={-1} className={`flex flex-col pr-2 ${contentClassName ?? ""}`}>
        {folders.result?.length === 0 && <div className="p-2 text-sm opacity-60">No subfolders</div>}
        {folders.result?.map(folder => {
          const added = selected.has(folder.path)
          return (
            <div key={folder.path} className="flex items-center">
              <Button
                variant="ghost"
                onPress={() => setCurrentPath(folder.path)}
                aria-label={`Open folder ${folder.name}`}
                className="grow justify-start overflow-hidden rounded-none"
              >
                <MdFolder className="shrink-0" aria-hidden />
                <span className="truncate">{folder.name}</span>
              </Button>
              {added ? (
                <span className="text-primary flex p-2" role="img" aria-label={`${folder.name} already added`}>
                  <MdCheck aria-hidden />
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Add folder ${folder.name}`}
                  onPress={() => onSelectFolder?.(folder.path)}
                >
                  <MdAdd />
                </Button>
              )}
            </div>
          )
        })}
      </div>
      <InputError errors={errors} className="justify-start" />
    </div>
  )
}

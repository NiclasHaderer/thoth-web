import { FC, Fragment, useEffect, useState } from "react"
import { MdAdd, MdCheck, MdFolder, MdHome } from "react-icons/md"
import { Api } from "@thoth/client"
import { ColoredButton } from "@thoth/components/colored-button"
import { IconButton } from "@thoth/components/icon-button"
import { InputError } from "@thoth/components/input/input-error"
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

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <div className="flex max-w-full justify-between overflow-hidden">
        <div className="flex">
          <IconButton
            icon={<MdHome className="h-4 w-4" />}
            label="Go to root folder"
            onClick={() => setCurrentPath("/")}
          />
          {currentPath
            .split("/")
            .filter(path => path !== "")
            .map((path, index, array) => (
              <Fragment key={index}>
                <ColoredButton
                  color="ghost"
                  aria-label={`Go to ${path}`}
                  onClick={() => {
                    const newPath = "/" + array.slice(0, index + 1).join("/")
                    setCurrentPath(newPath)
                  }}
                  innerClassName="p-2"
                >
                  {path}
                </ColoredButton>
                <span className="flex items-center">/</span>
              </Fragment>
            ))}
        </div>
      </div>
      <div tabIndex={-1} className={`flex flex-col pr-2 ${contentClassName ?? ""}`}>
        {folders.result?.length === 0 && <div className="p-2 text-sm opacity-60">No subfolders</div>}
        {folders.result?.map(folder => {
          const added = selected.has(folder.path)
          return (
            <div key={folder.path} className="flex items-center">
              <ColoredButton
                color="ghost"
                onClick={() => setCurrentPath(folder.path)}
                aria-label={`Open folder ${folder.name}`}
                className="grow rounded-none"
                innerClassName="justify-start gap-2 overflow-hidden p-2"
              >
                <MdFolder className="shrink-0" aria-hidden />
                <span className="truncate">{folder.name}</span>
              </ColoredButton>
              {added ? (
                <span className="text-primary flex p-2" role="img" aria-label={`${folder.name} already added`}>
                  <MdCheck aria-hidden />
                </span>
              ) : (
                <IconButton
                  icon={<MdAdd />}
                  label={`Add folder ${folder.name}`}
                  onClick={() => onSelectFolder?.(folder.path)}
                />
              )}
            </div>
          )
        })}
      </div>
      <InputError errors={errors} className="justify-start" />
    </div>
  )
}

import { FC, Fragment, useEffect, useState } from "react"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { Api } from "@thoth/client"
import { MdAutorenew, MdHome } from "react-icons/md"
import { ColoredButton } from "@thoth/components/colored-button"

export const FolderManager: FC<{
  onSelectFolder?: (path: string) => void
  contentClassName?: string
  className?: string
}> = ({ onSelectFolder, contentClassName, className }) => {
  const [currentPath, setCurrentPath] = useState("/")
  const folders = useHttpRequest(Api.listFoldersAtACertainPath)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => folders.invoke(currentPath), [currentPath])

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <div className="flex max-w-full justify-between overflow-hidden">
        <div className="flex">
          <button
            onClick={() => {
              setCurrentPath("/")
            }}
            className="p-2 hover:bg-active focus:bg-active"
          >
            <MdHome className="h-4 w-4" />
          </button>
          {currentPath
            .split("/")
            .filter(path => path !== "")
            .map((path, index, array) => (
              <Fragment key={index}>
                <button
                  onClick={() => {
                    const newPath = "/" + array.slice(0, index + 1).join("/")
                    setCurrentPath(newPath)
                  }}
                  className="p-2 hover:bg-active focus:bg-active"
                >
                  {path}
                </button>
                <span className="flex items-center">/</span>
              </Fragment>
            ))}
        </div>
        <div className="flex">
          <button
            onClick={() => setCurrentPath(currentPath)}
            className="flex w-full items-center p-2 hover:bg-active focus:bg-active"
          >
            <MdAutorenew className="mr-2" />
            Refresh
          </button>
        </div>
      </div>
      <div className={`flex flex-col ${contentClassName ?? ""}`}>
        {folders.result?.map((folder, index) => (
          <button
            onClick={() => setCurrentPath(folder.path)}
            className="w-full p-2 text-left hover:bg-active focus:bg-active"
            key={folder.path}
          >
            {folder.name}
          </button>
        ))}
      </div>
      <div className="flex justify-end" onClick={() => onSelectFolder?.(currentPath)}>
        <ColoredButton color="primary">Add Folder</ColoredButton>
      </div>
    </div>
  )
}

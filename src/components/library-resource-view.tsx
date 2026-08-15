import { FC, PropsWithChildren } from "react"
import { UUID } from "@thoth/client"
import { LibraryMenu } from "@thoth/components/menu/library-menu"

interface LibraryResourceViewProps extends PropsWithChildren {
  libraryId: UUID
}

export const LibraryResourceView: FC<LibraryResourceViewProps> = ({ children, libraryId }) => {
  return (
    <div className="flex min-h-0 grow overflow-hidden">
      <LibraryMenu libraryId={libraryId} className="hidden md:flex" />
      <main
        tabIndex={-1}
        className="min-w-0 grow overflow-x-hidden overflow-y-auto px-5 pb-[var(--dock-height,3.5rem)] focus-visible:outline-none md:mt-3 md:pb-0"
      >
        {children}
      </main>
    </div>
  )
}

import { FC, PropsWithChildren } from "react"
import { UUID } from "@thoth/client"
import { LibraryMenu } from "@thoth/components/menu/library-menu"
import { ScrollSurface } from "@thoth/components/scroll-surface"

interface LibraryResourceViewProps extends PropsWithChildren {
  libraryId: UUID
}

export const LibraryResourceView: FC<LibraryResourceViewProps> = ({ children, libraryId }) => (
  <div className="flex min-h-0 grow overflow-hidden">
    <LibraryMenu libraryId={libraryId} className="hidden md:flex" />
    <ScrollSurface
      as="main"
      tabIndex={-1}
      className="min-w-0 grow overflow-x-hidden overflow-y-auto px-5 pb-[var(--dock-height,3.5rem)] focus-visible:outline-none md:mt-3 md:pb-0"
    >
      {children}
    </ScrollSurface>
  </div>
)

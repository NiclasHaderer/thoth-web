import { FC, PropsWithChildren } from "react"
import { UUID } from "@thoth/client"
import { LibraryMenu } from "@thoth/components/menu/library-menu"
import { ScrollSurface } from "@thoth/components/scroll-surface"
import { useBreakpoint } from "@thoth/hooks/use-media-query"

interface LibraryResourceViewProps extends PropsWithChildren {
  libraryId: UUID
}

export const LibraryResourceView: FC<LibraryResourceViewProps> = ({ children, libraryId }) => {
  const isDesktop = useBreakpoint("md")

  return (
    <div className="flex min-h-0 grow overflow-hidden">
      {isDesktop ? <LibraryMenu libraryId={libraryId} /> : null}
      <ScrollSurface
        as="main"
        tabIndex={-1}
        className="min-w-0 grow overflow-x-hidden overflow-y-auto px-5 pb-4 focus-visible:outline-none md:mt-3"
      >
        {children}
      </ScrollSurface>
    </div>
  )
}

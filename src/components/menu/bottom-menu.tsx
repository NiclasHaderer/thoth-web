import { FC } from "react"
import { MdBook, MdCollectionsBookmark, MdPerson } from "react-icons/md"
import { UUID } from "@thoth/client"
import { ActiveLink } from "@thoth/components/active-link"
import { Ripple } from "@thoth/components/ripple"

export const BottomResourceMenu: FC<{ className?: string; libraryId: UUID }> = ({ className = "", libraryId }) => {
  return (
    <aside className="bg-surface">
      <div className={`relative flex h-16 items-center justify-between px-4 ${className}`}>
        <Ripple className="h-full flex-grow cursor-pointer bg-opacity-30" rippleClasses={"bg-primary bg-opacity-80"}>
          <ActiveLink
            href={`/libraries/${libraryId}/authors`}
            withSubRoutes={true}
            className="flex h-full items-center justify-center"
          >
            <MdPerson className="aspect-square h-3/5 w-auto" />
          </ActiveLink>
        </Ripple>
        <Ripple className="h-full flex-grow cursor-pointer" rippleClasses={"bg-primary bg-opacity-80"}>
          <ActiveLink
            href={`/libraries/${libraryId}/books`}
            withSubRoutes={true}
            className="flex h-full items-center justify-center"
          >
            <MdBook className="aspect-square h-3/5 w-auto" />
          </ActiveLink>
        </Ripple>
        <Ripple className="h-full flex-grow cursor-pointer" rippleClasses={"bg-primary bg-opacity-80"}>
          <ActiveLink
            href={`/libraries/${libraryId}/series`}
            withSubRoutes={true}
            className="flex h-full items-center justify-center"
          >
            <MdCollectionsBookmark className="aspect-square h-3/5 w-auto" />
          </ActiveLink>
        </Ripple>
      </div>
    </aside>
  )
}

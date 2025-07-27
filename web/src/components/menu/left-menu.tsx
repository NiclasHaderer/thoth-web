import { FC } from "react"
import { MdBook, MdCollectionsBookmark, MdPerson } from "react-icons/md"
import { UUID } from "@thoth/client"
import { ActiveLink } from "@thoth/components/active-link"

export const LeftResourceMenu: FC<{ libraryId: UUID }> = ({ libraryId }) => {
  return (
    <aside className="my-10 ml-10 inline-block min-w-80 max-w-80 overflow-hidden rounded-xl bg-elevate">
      <ul>
        <ActiveLink href={`/libraries/${libraryId}/books`} withSubRoutes={true}>
          <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
            <MdBook className="ml-3" />
            <span className="m-3 inline-block">Books</span>
          </li>
        </ActiveLink>
        <ActiveLink href={`/libraries/${libraryId}/series`} withSubRoutes={true}>
          <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
            <MdCollectionsBookmark className="ml-3" />
            <span className="m-3 inline-block">Series</span>
          </li>
        </ActiveLink>
        <ActiveLink href={`/libraries/${libraryId}/authors`} withSubRoutes={true}>
          <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
            <MdPerson className="ml-3" />
            <span className="m-3 inline-block">Authors</span>
          </li>
        </ActiveLink>
      </ul>
    </aside>
  )
}

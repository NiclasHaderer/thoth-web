import React from "react"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"
import { ActiveLink } from "@thoth/components/active-link"
import { MdBook, MdCollectionsBookmark, MdPerson } from "react-icons/md"

export const LeftResourceMenu: React.FC = () => {
  const currentLib = useAudiobookState(AudiobookSelectors.selectedLibraryId)
  return (
    <aside className="my-10 ml-10 inline-block min-w-80 max-w-80 overflow-hidden rounded-xl bg-elevate">
      <ul>
        <ActiveLink href={`/libraries/${currentLib}/books`} withSubRoutes={true}>
          <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
            <MdBook className="ml-3" />
            <span className="m-3 inline-block">Books</span>
          </li>
        </ActiveLink>
        <ActiveLink href={`/libraries/${currentLib}/series`} withSubRoutes={true}>
          <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
            <MdCollectionsBookmark className="ml-3" />
            <span className="m-3 inline-block">Series</span>
          </li>
        </ActiveLink>
        <ActiveLink href={`/libraries/${currentLib}/authors`} withSubRoutes={true}>
          <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
            <MdPerson className="ml-3" />
            <span className="m-3 inline-block">Authors</span>
          </li>
        </ActiveLink>
      </ul>
    </aside>
  )
}

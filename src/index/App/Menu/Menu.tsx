import React from "react"
import { MdBook, MdCollectionsBookmark, MdPerson, MdRefresh } from "react-icons/md"

import { AudiobookClient } from "../../API/AudiobookClient"
import { ActiveLink, ALink } from "../Common/ActiveLink"
import { Ripple } from "../Common/Ripple"
import { Search } from "./Search"
import { useSnackbar } from "../Common/Snackbar"

const MenuImage: React.VFC = () => {
  return (
    <ALink href="/" className="flex overflow-hidden rounded-l-xl" aria-label={"HOME"}>
      <div className="inline-flex cursor-pointer items-center pr-2 no-touch:group-focus:bg-light-active">
        <img
          className="h-20 p-3"
          src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Thoth.svg"
          loading="lazy"
          alt="Logo"
        />
        <h1 className="font-serif text-3xl font-extrabold">THOTH</h1>
      </div>
    </ALink>
  )
}

export const SearchBar: React.VFC = () => {
  const snackbar = useSnackbar()
  return (
    <div className="m-3 flex h-20 min-h-20 items-center rounded-xl bg-elevate pr-3">
      <MenuImage />
      <Search />
      <Ripple>
        <button
          className="h-12 w-12 cursor-pointer rounded-full p-2 focus:bg-light-active no-touch:focus:bg-light-active"
          style={{ transform: "scale(-1, 1)" }}
          onClick={async () => {
            await AudiobookClient.rescan()
            snackbar.show("Scheduled rescan")
          }}
        >
          <MdRefresh className="h-full w-full" />
        </button>
      </Ripple>
    </div>
  )
}

export const LargeMenu: React.FC = () => (
  <>
    <aside className="my-10 ml-10 inline-block min-w-80 max-w-80 overflow-hidden rounded-xl bg-elevate">
      <MenuItems />
    </aside>
  </>
)

export const SmallMenu: React.VFC = () => (
  <aside className="bg-background">
    <BottomToolbar className="bg-elevate" />
  </aside>
)

const MenuItems: React.VFC = () => (
  <ul>
    <ActiveLink href="/books" withSubroutes={true}>
      <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-light-active group-focus:bg-light-active">
        <MdBook className="ml-3" />
        <span className="m-3 inline-block">Books</span>
      </li>
    </ActiveLink>
    <ActiveLink href="/series" withSubroutes={true}>
      <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-light-active group-focus:bg-light-active">
        <MdCollectionsBookmark className="ml-3" />
        <span className="m-3 inline-block">Series</span>
      </li>
    </ActiveLink>
    <ActiveLink href="/authors" withSubroutes={true}>
      <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-light-active group-focus:bg-light-active">
        <MdPerson className="ml-3" />
        <span className="m-3 inline-block">Authors</span>
      </li>
    </ActiveLink>
  </ul>
)

const BottomToolbar: React.VFC<{ className?: string }> = ({ className = "" }) => (
  <div className={`relative flex h-16 items-center justify-between px-4 ${className}`}>
    <Ripple className="h-full flex-grow cursor-pointer bg-opacity-30" rippleClasses={"bg-primary bg-opacity-80"}>
      <ActiveLink href="/authors" withSubroutes={true} className="flex h-full items-center justify-center">
        <MdPerson className="aspect-square h-3/5 w-auto" />
      </ActiveLink>
    </Ripple>
    <Ripple className="h-full flex-grow cursor-pointer" rippleClasses={"bg-primary bg-opacity-80"}>
      <ActiveLink href="/books" withSubroutes={true} className="flex h-full items-center justify-center">
        <MdBook className="aspect-square h-3/5 w-auto" />
      </ActiveLink>
    </Ripple>
    <Ripple className="h-full flex-grow cursor-pointer" rippleClasses={"bg-primary bg-opacity-80"}>
      <ActiveLink href="/series" withSubroutes={true} className="flex h-full items-center justify-center">
        <MdCollectionsBookmark className="aspect-square h-3/5 w-auto" />
      </ActiveLink>
    </Ripple>
  </div>
)

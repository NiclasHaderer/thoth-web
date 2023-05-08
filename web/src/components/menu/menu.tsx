import React from "react"
import { MdAccountCircle, MdBook, MdCollectionsBookmark, MdLogout, MdPerson, MdSettings, MdTune } from "react-icons/md"
import { Search } from "./search"
import { ActiveLink } from "@thoth/components/active-link"
import { Ripple } from "@thoth/components/ripple"
import Link from "next/link"
import { Menu } from "@headlessui/react"
import { Logo } from "@thoth/components/icons/logo"
import { useAudiobookState } from "@thoth/state/audiobook.state"
import { AudiobookSelectors } from "@thoth/state/audiobook.selectors"

const MenuImage: React.FC = () => {
  return (
    <Link href="/libraries" className="flex overflow-hidden rounded-l-xl" aria-label={"HOME"}>
      <div className="inline-flex cursor-pointer items-center pr-2 no-touch:group-focus:bg-active-light">
        <Logo className="h-20 w-auto p-3" />
        <h1 className="font-serif text-3xl font-extrabold">THOTH</h1>
      </div>
    </Link>
  )
}

export const SearchBar: React.FC = () => {
  return (
    <div className="m-3 flex h-20 min-h-20 items-center rounded-xl bg-elevate pr-3">
      <MenuImage />
      <Search />
      <Menu as="div" className="relative">
        <Menu.Button className="h-12 w-12 cursor-pointer rounded-full p-2 focus:bg-active-light no-touch:focus:bg-active-light">
          <MdAccountCircle className="h-full w-full" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 w-56 origin-top-right divide-y rounded-md border-1 border-solid border-active bg-elevate-2 shadow-lg focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <ActiveLink
                  href={"/account"}
                  className={`${
                    active ? "bg-active-light" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <MdPerson className="mr-3 h-6 w-6" />
                  Account
                </ActiveLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <ActiveLink
                  href="/logout"
                  className={`${
                    active ? "bg-active-light" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <MdLogout className="mr-3 h-6 w-6" />
                  Logout
                </ActiveLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <ActiveLink
                  href="/settings"
                  className={`${
                    active ? "bg-active-light" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <MdTune className="mr-3 h-6 w-6" />
                  Server Settings
                </ActiveLink>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  )
}

export const LeftResourceMenu: React.FC = () => (
  <>
    <aside className="my-10 ml-10 inline-block min-w-80 max-w-80 overflow-hidden rounded-xl bg-elevate">
      <MenuItems />
    </aside>
  </>
)

export const BottomResourceMenu: React.FC = () => (
  <aside className="bg-surface">
    <BottomToolbar className="bg-elevate" />
  </aside>
)

const MenuItems: React.FC = () => {
  const currentLib = useAudiobookState(AudiobookSelectors.selectedLibraryId)
  return (
    <ul>
      <ActiveLink href={`/libraries/${currentLib}/books`} withSubroutes={true}>
        <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
          <MdBook className="ml-3" />
          <span className="m-3 inline-block">Books</span>
        </li>
      </ActiveLink>
      <ActiveLink href={`/libraries/${currentLib}/series`} withSubroutes={true}>
        <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
          <MdCollectionsBookmark className="ml-3" />
          <span className="m-3 inline-block">Series</span>
        </li>
      </ActiveLink>
      <ActiveLink href={`/libraries/${currentLib}/authors`} withSubroutes={true}>
        <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
          <MdPerson className="ml-3" />
          <span className="m-3 inline-block">Authors</span>
        </li>
      </ActiveLink>
    </ul>
  )
}

const BottomToolbar: React.FC<{ className?: string }> = ({ className = "" }) => {
  const currentLib = useAudiobookState(AudiobookSelectors.selectedLibraryId)
  return (
    <div className={`relative flex h-16 items-center justify-between px-4 ${className}`}>
      <Ripple className="h-full flex-grow cursor-pointer bg-opacity-30" rippleClasses={"bg-primary bg-opacity-80"}>
        <ActiveLink
          href={`/libraries/${currentLib}/books`}
          withSubroutes={true}
          className="flex h-full items-center justify-center"
        >
          <MdPerson className="aspect-square h-3/5 w-auto" />
        </ActiveLink>
      </Ripple>
      <Ripple className="h-full flex-grow cursor-pointer" rippleClasses={"bg-primary bg-opacity-80"}>
        <ActiveLink
          href={`/libraries/${currentLib}/books`}
          withSubroutes={true}
          className="flex h-full items-center justify-center"
        >
          <MdBook className="aspect-square h-3/5 w-auto" />
        </ActiveLink>
      </Ripple>
      <Ripple className="h-full flex-grow cursor-pointer" rippleClasses={"bg-primary bg-opacity-80"}>
        <ActiveLink
          href={`/libraries/${currentLib}/books`}
          withSubroutes={true}
          className="flex h-full items-center justify-center"
        >
          <MdCollectionsBookmark className="aspect-square h-3/5 w-auto" />
        </ActiveLink>
      </Ripple>
    </div>
  )
}

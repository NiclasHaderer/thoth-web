import React from "react"
import { MdAccountCircle, MdBook, MdCollectionsBookmark, MdPerson } from "react-icons/md"
import { Search } from "./search"
import { ActiveLink } from "@thoth/components/active-link"
import { Ripple } from "@thoth/components/ripple"
import Link from "next/link"

const MenuImage: React.VFC = () => {
  return (
    <Link href="/" className="flex overflow-hidden rounded-l-xl" aria-label={"HOME"}>
      <div className="inline-flex cursor-pointer items-center pr-2 no-touch:group-focus:bg-active-light">
        <img className="h-20 p-3" src="/logo.svg" loading="lazy" alt="Logo" />
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
      <Ripple>
        <Link href="account">
          <button className="h-12 w-12 cursor-pointer rounded-full p-2 focus:bg-active-light no-touch:focus:bg-active-light">
            <MdAccountCircle className="h-full w-full" />
          </button>
        </Link>
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

export const SmallMenu: React.FC = () => (
  <aside className="bg-surface">
    <BottomToolbar className="bg-elevate" />
  </aside>
)

const MenuItems: React.FC = () => (
  <ul>
    <ActiveLink href="/books" withSubroutes={true}>
      <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
        <MdBook className="ml-3" />
        <span className="m-3 inline-block">Books</span>
      </li>
    </ActiveLink>
    <ActiveLink href="/series" withSubroutes={true}>
      <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
        <MdCollectionsBookmark className="ml-3" />
        <span className="m-3 inline-block">Series</span>
      </li>
    </ActiveLink>
    <ActiveLink href="/authors" withSubroutes={true}>
      <li className="flex w-full items-center px-3 transition-colors duration-300 hover:bg-active-light group-focus:bg-active-light">
        <MdPerson className="ml-3" />
        <span className="m-3 inline-block">Authors</span>
      </li>
    </ActiveLink>
  </ul>
)

const BottomToolbar: React.FC<{ className?: string }> = ({ className = "" }) => (
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

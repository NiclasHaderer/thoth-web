import React from "react"
import Link from "next/link"
import { Logo } from "@thoth/components/icons/logo"
import { Search } from "@thoth/components/menu/search"
import { Menu } from "@headlessui/react"
import { MdAccountCircle, MdLogout, MdPerson, MdTune } from "react-icons/md"
import { ActiveLink } from "@thoth/components/active-link"
import { useAuthState } from "@thoth/state/auth.state"

export const SearchBar: React.FC = () => {
  const jwt = useAuthState(s => s.accessToken)
  return (
    <div className="m-3 flex h-20 min-h-20 items-center rounded-xl bg-elevate pr-3">
      <Link href="/libraries" className="flex overflow-hidden rounded-l-xl" aria-label={"HOME"}>
        <div className="inline-flex cursor-pointer items-center pr-2 no-touch:group-focus:bg-active-light">
          <Logo className="h-20 w-auto p-3" />
          <h1 className="font-serif text-3xl font-extrabold">THOTH</h1>
        </div>
      </Link>
      <Search />
      <Menu as="div" className="relative">
        <Menu.Button
          id="user-account-menu"
          className="h-12 w-12 cursor-pointer rounded-full p-2 focus:bg-active-light no-touch:focus:bg-active-light"
        >
          <MdAccountCircle className="h-full w-full" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 z-10 w-56 origin-top-right divide-y rounded-md border-1 border-solid border-active bg-elevate-2 shadow-lg focus:outline-none">
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
            {jwt?.payload.admin && (
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
            )}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  )
}

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { FC } from "react"
import { MdAccountCircle, MdLogout, MdPerson, MdTune } from "react-icons/md"
import { Link } from "wouter"
import { Api } from "@thoth/client"
import { ActiveLink } from "@thoth/components/active-link"
import { Logo } from "@thoth/components/icons/logo"
import { Search } from "@thoth/components/menu/search"
import { useHttpRequest } from "@thoth/hooks/async-response.ts"
import { useOnMount } from "@thoth/hooks/lifecycle.ts"

export const SearchBar: FC = () => {
  const { result, invoke } = useHttpRequest(Api.getCurrentUser)
  useOnMount(() => invoke())
  return (
    <div className="bg-elevate m-3 flex h-20 min-h-20 items-center rounded-xl pr-3">
      <Link href={"/libraries"} className="flex overflow-hidden rounded-l-xl" aria-label={"HOME"}>
        <div className="no-touch:group-focus:bg-active-light inline-flex cursor-pointer items-center pr-2">
          <Logo className="h-20 w-auto p-3" />
          <h1 className="font-serif text-3xl font-extrabold">THOTH</h1>
        </div>
      </Link>
      <Search />
      <Menu as="div" className="relative">
        {({ close }) => {
          return (
            <>
              <MenuButton
                id="user-account-menu"
                className="hover:bg-active-light focus:bg-active-light no-touch:focus:bg-active-light h-12 w-12 cursor-pointer rounded-full p-2 transition-colors"
              >
                <MdAccountCircle className="h-full w-full" />
              </MenuButton>
              <MenuItems className="border-active bg-elevate-2 absolute right-0 z-10 w-56 origin-top-right divide-y rounded-md border-1 border-solid shadow-lg focus:outline-none">
                <div className="px-1 py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <ActiveLink
                        onClick={close}
                        href={"/account"}
                        className={`${
                          focus ? "bg-active-light" : "text-gray-900"
                        } group hover:bg-active-light flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                      >
                        <MdPerson className="mr-3 h-6 w-6" />
                        Account
                      </ActiveLink>
                    )}
                  </MenuItem>{" "}
                  {result?.permissions?.isAdmin && (
                    <MenuItem>
                      {({ focus }) => (
                        <ActiveLink
                          onClick={close}
                          href="/settings"
                          className={`${
                            focus ? "bg-active-light" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <MdTune className="mr-3 h-6 w-6" />
                          Server Settings
                        </ActiveLink>
                      )}
                    </MenuItem>
                  )}
                  <MenuItem>
                    {({ focus }) => (
                      <ActiveLink
                        onClick={close}
                        href="/logout"
                        className={`${
                          focus ? "bg-active-light" : "text-gray-900"
                        } group hover:bg-active-light flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors`}
                      >
                        <MdLogout className="mr-3 h-6 w-6" />
                        Logout
                      </ActiveLink>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </>
          )
        }}
      </Menu>
    </div>
  )
}

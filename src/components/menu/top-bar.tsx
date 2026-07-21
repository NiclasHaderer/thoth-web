import { FC } from "react"
import { Button, MenuTrigger } from "react-aria-components"
import { MdAccountCircle, MdLogout, MdPerson, MdTune } from "react-icons/md"
import { Link, useLocation } from "wouter"
import { Api } from "@thoth/client"
import { Logo } from "@thoth/components/icons/logo"
import { Search } from "@thoth/components/menu/search"
import { DropdownMenu, DropdownMenuItem } from "@thoth/components/ui/dropdown-menu"
import { useHttpRequest } from "@thoth/hooks/async-response.ts"
import { useOnMount } from "@thoth/hooks/lifecycle.ts"

export const SearchBar: FC = () => {
  const { result, invoke } = useHttpRequest(Api.getCurrentUser)
  const [, navigate] = useLocation()
  useOnMount(() => invoke())
  return (
    <div className="bg-card m-3 flex h-20 min-h-20 items-center rounded-xl pr-3">
      <Link
        href={"/libraries"}
        className="focus-visible:bg-accent flex overflow-hidden rounded-l-xl transition-colors outline-none"
        aria-label="Thoth home"
      >
        <div className="inline-flex cursor-pointer items-center pr-2">
          <Logo className="h-20 w-auto p-3" />
          <h1 className="font-serif text-3xl font-extrabold">THOTH</h1>
        </div>
      </Link>
      <Search />
      <MenuTrigger>
        <Button
          id="user-account-menu"
          className="bg-popover hover:bg-accent focus-visible:bg-accent h-12 w-12 cursor-pointer rounded-full p-2 transition-colors outline-none"
        >
          <MdAccountCircle className="h-full w-full" />
        </Button>
        <DropdownMenu placement="bottom end" className="w-56">
          <DropdownMenuItem onAction={() => navigate("/account")}>
            <MdPerson className="mr-3 h-6 w-6" />
            Account
          </DropdownMenuItem>
          {result?.permissions?.isAdmin && (
            <DropdownMenuItem onAction={() => navigate("/settings")}>
              <MdTune className="mr-3 h-6 w-6" />
              Server Settings
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onAction={() => navigate("/logout")}>
            <MdLogout className="mr-3 h-6 w-6" />
            Logout
          </DropdownMenuItem>
        </DropdownMenu>
      </MenuTrigger>
    </div>
  )
}

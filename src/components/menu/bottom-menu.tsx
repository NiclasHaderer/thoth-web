import { FC } from "react"
import { MdBook, MdCollectionsBookmark, MdPerson } from "react-icons/md"
import { Link, useLocation } from "wouter"
import { UUID } from "@thoth/client"
import { Ripple } from "@thoth/components/ripple"
import { buttonVariants } from "@thoth/components/ui/button"

export const BottomResourceMenu: FC<{ className?: string; libraryId: UUID }> = ({ className = "", libraryId }) => {
  const [pathname] = useLocation()
  const items = [
    { href: `/libraries/${libraryId}/authors`, Icon: MdPerson },
    { href: `/libraries/${libraryId}/books`, Icon: MdBook },
    { href: `/libraries/${libraryId}/series`, Icon: MdCollectionsBookmark },
  ]
  return (
    <aside className="bg-background">
      <div className={`relative flex h-16 items-center justify-between px-4 ${className}`}>
        {items.map(({ href, Icon }) => (
          <Ripple key={href} className="h-full grow cursor-pointer" rippleClasses={"bg-primary bg-opacity-80"}>
            <Link
              href={href}
              className={buttonVariants({
                variant: "ghost",
                className: `h-full w-full rounded-none ${pathname.startsWith(href) ? "text-primary" : ""}`,
              })}
            >
              <Icon className="size-9" />
            </Link>
          </Ripple>
        ))}
      </div>
    </aside>
  )
}

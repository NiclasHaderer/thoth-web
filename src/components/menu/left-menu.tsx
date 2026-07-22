import { BookIcon, BookMarkedIcon, UserIcon } from "lucide-react"
import { FC } from "react"
import { Link, useLocation } from "wouter"
import { UUID } from "@thoth/client"
import { buttonVariants } from "@thoth/components/ui/button"

export const LeftResourceMenu: FC<{ libraryId: UUID }> = ({ libraryId }) => {
  const [pathname] = useLocation()
  const items = [
    { href: `/libraries/${libraryId}/books`, Icon: BookIcon, label: "Books" },
    { href: `/libraries/${libraryId}/series`, Icon: BookMarkedIcon, label: "Series" },
    { href: `/libraries/${libraryId}/authors`, Icon: UserIcon, label: "Authors" },
  ]
  return (
    <aside className="bg-card my-10 ml-10 inline-block max-w-80 min-w-80 overflow-hidden rounded-xl">
      <ul className="flex flex-col gap-1 p-2">
        {items.map(({ href, Icon, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: `w-full justify-start gap-3 ${pathname.startsWith(href) ? "text-primary" : ""}`,
              })}
            >
              <Icon />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

import { cn } from "cn"
import { FC, ReactNode } from "react"
import { Logo } from "@dewey/components/icons/logo"
import { Link } from "@dewey/components/link.tsx"

export const MobileTopBar: FC<{
  children?: ReactNode
  backdrop?: ReactNode
  below?: ReactNode
  className?: string
}> = ({ children, backdrop, below, className }) => (
  <div className={cn("sticky top-0 z-10 -mx-5 px-5 pt-4 pb-3 backdrop-blur-xl", className)}>
    {backdrop}
    {/* Fixed height, fitting the search input, so the logo stays put when switching tabs. */}
    <div className="relative flex h-12 items-center gap-3.5">
      <Link href="/libraries" aria-label="Dewey home" className="shrink-0 outline-none md:hidden">
        <Logo className="h-8 w-auto" />
      </Link>
      {children}
    </div>
    {below}
  </div>
)

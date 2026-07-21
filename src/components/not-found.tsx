import { Link } from "wouter"
import { buttonVariants } from "@thoth/components/ui/button"

export const NotFound = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="z-10 text-center">
        <h1 className="text-8xl font-bold sm:text-9xl lg:text-[12rem]">404</h1>

        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Page Not Found</h2>

        <p className="mx-auto my-4 max-w-md">
          Looks like the signal was lost. We can't seem to find the page you're looking for.
        </p>

        <Link href="/" className={buttonVariants({ className: "font-bold shadow-lg" })}>
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

import { CloudOffIcon, LucideIcon, TriangleAlertIcon } from "lucide-react"
import { FC, ReactNode } from "react"
import { isNetworkError, isNotFoundError } from "@thoth/client/api-error"
import { Link } from "@thoth/components/link.tsx"
import { Button, buttonVariants } from "@thoth/components/ui/button"

const StatusPage: FC<{ display: ReactNode; title: string; message: string; action?: ReactNode }> = ({
  display,
  title,
  message,
  action,
}) => (
  <div className="@container relative flex min-h-full grow items-center justify-center overflow-hidden p-4">
    <div className="z-10 text-center">
      {display}

      <h2 className="mt-2 text-xl font-semibold @md:text-2xl @3xl:text-3xl">{title}</h2>

      <p className="mx-auto my-4 max-w-md text-sm @md:text-base">{message}</p>

      {action}
    </div>
  </div>
)

const StatusIcon: FC<{ icon: LucideIcon }> = ({ icon: Icon }) => (
  <Icon className="text-muted-foreground/60 mx-auto size-20 @md:size-28 @3xl:size-36" strokeWidth={1.25} />
)

const HomeLink = () => (
  <Link href="/" className={buttonVariants({ className: "font-bold shadow-lg" })}>
    Go Back Home
  </Link>
)

export const NotFound = () => (
  <StatusPage
    display={<h1 className="text-7xl font-bold @md:text-9xl @3xl:text-[12rem]">404</h1>}
    title="Page Not Found"
    message="Looks like the signal was lost. We can't seem to find the page you're looking for."
    action={<HomeLink />}
  />
)

export const QueryError: FC<{ error: unknown; onRetry?: () => void }> = ({ error, onRetry }) => {
  const retry = onRetry ? (
    <Button onPress={onRetry} className="font-bold shadow-lg">
      Try Again
    </Button>
  ) : (
    <HomeLink />
  )

  if (isNotFoundError(error)) return <NotFound />

  if (isNetworkError(error))
    return (
      <StatusPage
        display={<StatusIcon icon={CloudOffIcon} />}
        title="You are offline"
        message="This one is not available offline. It will load again once you are back on the network."
        action={retry}
      />
    )

  return (
    <StatusPage
      display={<StatusIcon icon={TriangleAlertIcon} />}
      title="Something went wrong"
      message={error instanceof Error && error.message ? error.message : "This page could not be loaded."}
      action={retry}
    />
  )
}

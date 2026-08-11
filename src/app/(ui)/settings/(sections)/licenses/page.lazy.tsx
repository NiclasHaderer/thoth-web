import { ChevronRightIcon } from "lucide-react"
import { FC } from "react"
import webLicensesUrl from "@thoth/assets/third-party-licenses.json?url"
import { Api, ThirdPartyLicense } from "@thoth/client"
import { _request } from "@thoth/client/generated/client"
import { Badge } from "@thoth/components/ui/badge"
import { useHttpRequest } from "@thoth/hooks/async-response"
import { useOnMount } from "@thoth/hooks/lifecycle"

const LicenseList: FC<{ licenses: ThirdPartyLicense[] }> = ({ licenses }) => (
  <div className="flex flex-col gap-2">
    {licenses.map(pkg => (
      <details key={`${pkg.name}@${pkg.version}`} className="bg-card group rounded-xl">
        <summary className="flex cursor-pointer list-none items-center gap-2 p-4">
          <ChevronRightIcon className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-90" />
          <span className="truncate font-medium">{pkg.name}</span>
          <span className="text-muted-foreground shrink-0 text-xs">{pkg.version}</span>
          <Badge variant="secondary" className="ml-auto shrink-0">
            {pkg.license}
          </Badge>
        </summary>
        <div className="flex flex-col gap-3 px-4 pb-4">
          {pkg.repository && (
            <a
              href={pkg.repository}
              target="_blank"
              rel="noreferrer"
              className="text-primary w-fit text-sm hover:underline"
            >
              {pkg.repository}
            </a>
          )}
          {pkg.licenseUrl && (
            <a
              href={pkg.licenseUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary w-fit text-sm hover:underline"
            >
              {pkg.licenseUrl}
            </a>
          )}
          {pkg.text && (
            <pre className="text-muted-foreground max-h-80 overflow-auto rounded-lg text-xs whitespace-pre-wrap">
              {pkg.text}
            </pre>
          )}
        </div>
      </details>
    ))}
  </div>
)

const fetchWebLicenses = () =>
  _request<ThirdPartyLicense[]>(
    webLicensesUrl,
    "GET",
    "json",
    new Headers(),
    undefined,
    [],
    data => fetch(data.route),
    false
  )

export const SettingsLicensesOutlet = () => {
  const server = useHttpRequest(Api.listThirdPartyLicenses)
  const web = useHttpRequest(fetchWebLicenses)
  useOnMount(() => {
    void server.invoke()
    void web.invoke()
  })

  return (
    <>
      <h2 className="mb-1 text-xl">Open source licenses</h2>
      <p className="text-muted-foreground mb-6 text-sm">
        Thoth is built on open source software. Thank you to their authors.
      </p>

      <h3 className="mb-3 text-lg">Web{web.result ? ` (${web.result.length})` : ""}</h3>
      {web.error ? (
        <p className="text-muted-foreground text-sm">Could not load the web licenses.</p>
      ) : web.result ? (
        <LicenseList licenses={web.result} />
      ) : (
        <p className="text-muted-foreground text-sm">Loading...</p>
      )}

      <h3 className="mt-8 mb-3 text-lg">Server{server.result ? ` (${server.result.length})` : ""}</h3>
      {server.error ? (
        <p className="text-muted-foreground text-sm">Could not load the server licenses.</p>
      ) : server.result ? (
        <LicenseList licenses={server.result} />
      ) : (
        <p className="text-muted-foreground text-sm">Loading...</p>
      )}
    </>
  )
}

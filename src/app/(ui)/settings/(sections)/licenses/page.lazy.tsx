import { ChevronRightIcon } from "lucide-react"
import { FC } from "react"
import { ThirdPartyLicense } from "@thoth/client"
import { SettingsSection } from "@thoth/components/settings/settings-section"
import { Badge } from "@thoth/components/ui/badge"
import { useServerLicenses, useWebLicenses } from "@thoth/queries/system"

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

export const SettingsLicensesOutlet = () => {
  const server = useServerLicenses()
  const web = useWebLicenses()

  return (
    <SettingsSection
      title="Open source licenses"
      description="Thoth is built on open source software. Thank you to their authors."
    >
      <h3 className="mb-3 text-lg">Web ({web.data?.length ?? 0})</h3>
      {web.isError ? (
        <p className="text-muted-foreground text-sm">Could not load the web licenses.</p>
      ) : web.data ? (
        <LicenseList licenses={web.data} />
      ) : (
        <p className="text-muted-foreground text-sm">Loading...</p>
      )}

      <h3 className="mt-8 mb-3 text-lg">Server ({server.data?.length ?? 0})</h3>
      {server.isError ? (
        <p className="text-muted-foreground text-sm">Could not load the server licenses.</p>
      ) : server.data ? (
        <LicenseList licenses={server.data} />
      ) : (
        <p className="text-muted-foreground text-sm">Loading...</p>
      )}
    </SettingsSection>
  )
}

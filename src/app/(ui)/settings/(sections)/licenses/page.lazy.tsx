import { ChevronRightIcon } from "lucide-react"
import licenses from "@thoth/assets/third-party-licenses.json"
import { Badge } from "@thoth/components/ui/badge"

export const SettingsLicensesOutlet = () => {
  return (
    <>
      <h2 className="mb-1 text-xl">Open source licenses</h2>
      <p className="text-muted-foreground mb-4 text-sm">
        Thoth is built on {licenses.length} open source packages. Thank you to their authors.
      </p>
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
              {pkg.text && (
                <pre className="text-muted-foreground max-h-80 overflow-auto rounded-lg text-xs whitespace-pre-wrap">
                  {pkg.text}
                </pre>
              )}
            </div>
          </details>
        ))}
      </div>
    </>
  )
}

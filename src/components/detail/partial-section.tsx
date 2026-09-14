import { FC, ReactNode } from "react"
import { isNetworkError } from "@thoth/client/error"
import { detailLabel } from "@thoth/components/detail/detail-layout"

export const PartialSection: FC<{
  title: string
  loading: boolean
  skeleton: ReactNode
  error?: unknown
  className?: string
}> = ({ title, error, loading, skeleton, className }) => (
  <section className={className}>
    <h2 className={`${detailLabel} pb-3`}>{title}</h2>
    {loading ? (
      skeleton
    ) : (
      <p className="text-muted-foreground text-sm">
        {isNetworkError(error) ? "Not available offline" : "Could not be loaded"}
      </p>
    )}
  </section>
)

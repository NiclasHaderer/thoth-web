import { UUID } from "@/client"
import { BookPreview } from "@/components/book/book-preview.tsx"
import { DetailLayout, detailLabel } from "@/components/detail/detail-layout"
import { DetailList } from "@/components/detail/detail-list.tsx"
import { DetailSkeleton } from "@/components/detail/detail-skeleton"
import { PartialSection } from "@/components/detail/partial-section"
import { HtmlViewer } from "@/components/html-editor"
import { ResponsiveGrid } from "@/components/responsive-grid"
import { isDetailedSeries } from "@/models/model-typeguards"
import { useAutoMatchSeries, useSeries } from "@/queries/resource-queries"
import { pluralize } from "@/utils/utils.ts"
import { FC } from "react"
import { openDialog } from "@thoth/components/dialogs"
import { EditButton } from "@thoth/components/generic/edit-button"
import { PreviewGridSkeleton } from "@thoth/components/generic/preview-skeleton"
import { ResourceActions } from "@thoth/components/generic/resource-actions"
import { QueryError } from "@thoth/components/status-page.tsx"

const loadSeriesEdit = () => import("./series-edit").then(module => module.SeriesEdit)

export const SeriesDetails: FC<{ seriesId: UUID; libraryId: UUID }> = ({ seriesId, libraryId }) => {
  const { data: series, error, refetch, isFetching, isLoadingError, isPending } = useSeries(libraryId, seriesId)
  const autoMatchSeries = useAutoMatchSeries()

  if (isLoadingError) return <QueryError error={error} onRetry={refetch} />
  if (isPending)
    return (
      <DetailSkeleton>
        <PreviewGridSkeleton subtitle />
      </DetailSkeleton>
    )

  const detailed = isDetailedSeries(series)

  const narrators = detailed ? series.narrators : []

  const years = detailed && series.yearRange ? `${series.yearRange.start} - ${series.yearRange.end}` : null

  const stats: { label: string; value: string | number }[] = []
  if (years) stats.push({ label: "Published", value: years })
  if (series.totalBooks) stats.push({ label: "Total works", value: series.totalBooks })
  if (series.primaryWorks) stats.push({ label: "Primary works", value: series.primaryWorks })

  return (
    <DetailLayout
      title={series.title}
      subtitle={
        series.authors.length > 0 ? (
          <DetailList
            prefix="Written by"
            items={series.authors.map(author => ({
              key: author.id,
              label: author.name,
              href: `/libraries/${libraryId}/authors/${author.id}`,
            }))}
          />
        ) : null
      }
      credit={
        <>
          {narrators.length > 0 ? (
            <DetailList
              prefix="Narrated by"
              items={narrators.map(narrator => ({
                key: narrator,
                label: narrator,
                href: `/libraries/${libraryId}/narrators/${encodeURIComponent(narrator)}`,
              }))}
            />
          ) : null}
          {stats.map(stat => (
            <span key={stat.label} className="whitespace-nowrap">
              <span className="text-muted-foreground">{stat.label} </span>
              <span className="text-foreground">{stat.value}</span>
            </span>
          ))}
        </>
      }
      body={
        series.description ? <HtmlViewer className="prose-sm" content={series.description} collapsedLines={3} /> : null
      }
      actions={
        <>
          <EditButton onPress={() => openDialog(loadSeriesEdit, { series })} />
          <ResourceActions libraryId={libraryId} id={series.id} label="series" autoMatch={autoMatchSeries} />
        </>
      }
    >
      {detailed ? (
        <section>
          <h2 className={`${detailLabel} pb-3`}>{pluralize(series.books.length, "Book")}</h2>
          <ResponsiveGrid>
            {series.books.map((book, k) => (
              <BookPreview {...book} key={k} />
            ))}
          </ResponsiveGrid>
        </section>
      ) : (
        <PartialSection title="Books" error={error} loading={isFetching} skeleton={<PreviewGridSkeleton subtitle />} />
      )}
    </DetailLayout>
  )
}

export default SeriesDetails

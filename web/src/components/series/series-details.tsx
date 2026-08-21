import { UUID } from "@/client"
import { BookPreview } from "@/components/book/book-preview.tsx"
import { DetailFact, DetailLayout, detailLabel } from "@/components/detail/detail-layout"
import { DetailList } from "@/components/detail/detail-list.tsx"
import { HtmlViewer } from "@/components/html-editor"
import { ResponsiveGrid } from "@/components/responsive-grid"
import { isDetailedSeries } from "@/models/typeguards"
import { useSeries } from "@/queries/resources"
import { pluralize } from "@/utils/utils.ts"
import { FC } from "react"
import SeriesEdit from "./series-edit"

export const SeriesDetails: FC<{ seriesId: UUID; libraryId: UUID }> = ({ seriesId, libraryId }) => {
  const { data: series } = useSeries(libraryId, seriesId)

  if (!series) return <></>

  const detailed = isDetailedSeries(series)

  const narrators = detailed ? series.narrators : []

  const years = detailed && series.yearRange ? `${series.yearRange.start} - ${series.yearRange.end}` : null

  const facts: DetailFact[] = []
  if (series.totalBooks) facts.push({ label: "Total works", value: series.totalBooks })
  if (series.primaryWorks) facts.push({ label: "Primary works", value: series.primaryWorks })

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
          {years ? (
            <span className="w-full">
              <span className="text-muted-foreground">Published </span>
              <span className="text-foreground">{years}</span>
            </span>
          ) : null}
        </>
      }
      actions={detailed ? <SeriesEdit series={series} /> : null}
      facts={facts}
    >
      {series.description ? (
        <div className="pb-10">
          <HtmlViewer title="Description" content={series.description} collapsedLines={3} />
        </div>
      ) : null}

      {detailed ? (
        <section>
          <h2 className={`${detailLabel} pb-3`}>{pluralize(series.books.length, "Book")}</h2>
          <ResponsiveGrid>
            {series.books.map((book, k) => (
              <BookPreview {...book} key={k} />
            ))}
          </ResponsiveGrid>
        </section>
      ) : null}
    </DetailLayout>
  )
}

export default SeriesDetails

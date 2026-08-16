import { BookMarkedIcon } from "lucide-react"
import { FC, ReactNode } from "react"
import { Link } from "wouter"
import { UUID } from "@thoth/client"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { DetailLayout, DetailRail, RailItem, entityLink } from "@thoth/components/detail/detail-layout"
import { HtmlViewer } from "@thoth/components/html-editor"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { isDetailedSeries } from "@thoth/models/typeguards"
import { useSeries } from "@thoth/queries/resources"
import { pluralize } from "../../utils/utils"
import SeriesEdit from "./series-edit"

export const SeriesDetails: FC<{ seriesId: UUID; libraryId: UUID }> = ({ seriesId, libraryId }) => {
  const { data: series } = useSeries(libraryId, seriesId)

  if (!series) return <></>

  const detailed = isDetailedSeries(series)

  const facts: ReactNode[] = []
  if (series.authors.length > 0) {
    facts.push(
      <span className="flex flex-wrap gap-x-1">
        {series.authors.map((author, index) => (
          <Link key={author.id} href={`/libraries/${libraryId}/authors/${author.id}`} className={entityLink}>
            {author.name}
            {index < series.authors.length - 1 ? "," : ""}
          </Link>
        ))}
      </span>
    )
  }
  if (detailed && series.yearRange) facts.push(`${series.yearRange.start} - ${series.yearRange.end}`)
  if (detailed) facts.push(pluralize(series.books.length, "book"))

  const hasRail = series.totalBooks || series.primaryWorks

  return (
    <DetailLayout
      title={series.title}
      fallbackIcon={BookMarkedIcon}
      facts={facts}
      details={
        detailed && series.narrators.length > 0 ? (
          <p className="text-muted-foreground text-sm">Narrated by {series.narrators.join(", ")}</p>
        ) : null
      }
      actions={detailed ? <SeriesEdit series={series} /> : null}
      aside={
        hasRail ? (
          <DetailRail>
            {series.totalBooks ? <RailItem label="Total works">{series.totalBooks}</RailItem> : null}
            {series.primaryWorks ? <RailItem label="Primary works">{series.primaryWorks}</RailItem> : null}
          </DetailRail>
        ) : null
      }
    >
      {series.description ? (
        <div className="pb-10">
          <HtmlViewer title="Description" content={series.description} collapsedLines={3} />
        </div>
      ) : null}

      {detailed ? (
        <section>
          <h2 className="pb-3 text-xl">{pluralize(series.books.length, "Book")}</h2>
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

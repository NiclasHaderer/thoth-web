import { FC } from "react"
import { UUID } from "@dewey/client"
import { BookPreview } from "@dewey/components/book/book-preview.tsx"
import { DetailLayout } from "@dewey/components/detail/detail-layout"
import { DetailSkeleton } from "@dewey/components/detail/detail-skeleton"
import { PreviewGridSkeleton, PreviewSkeleton } from "@dewey/components/generic/preview-skeleton"
import { ResourceGrid } from "@dewey/components/resource-grid"
import { RESPONSIVE_GRID } from "@dewey/components/responsive-grid"
import { QueryError } from "@dewey/components/status-page.tsx"
import { NameResource } from "@dewey/queries/query-definitions"
import { useNameDetail } from "@dewey/queries/resource-queries"
import { pluralize } from "@dewey/utils/utils"

export const NameBooks: FC<{ resource: NameResource; libraryId: UUID; name: string }> = ({
  resource,
  libraryId,
  name,
}) => {
  const { data, error, refetch, isLoadingError, isPending } = useNameDetail(resource, libraryId, name)

  if (isLoadingError) return <QueryError error={error} onRetry={refetch} />
  if (isPending)
    return (
      <DetailSkeleton>
        <PreviewGridSkeleton subtitle />
      </DetailSkeleton>
    )

  return (
    <DetailLayout title={data.name} titleClassName="uppercase" credit={pluralize(data.books.length, "book")}>
      <ResourceGrid
        listKey={`name-books:${name}`}
        total={data.books.length}
        itemAt={index => data.books[index]}
        listClassName={RESPONSIVE_GRID}
        renderItem={book => <BookPreview {...book} />}
        renderSkeleton={() => <PreviewSkeleton subtitle />}
      />
    </DetailLayout>
  )
}

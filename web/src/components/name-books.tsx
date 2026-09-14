import { FC } from "react"
import { UUID } from "@thoth/client"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { DetailLayout } from "@thoth/components/detail/detail-layout"
import { DetailSkeleton } from "@thoth/components/detail/detail-skeleton"
import { PreviewGridSkeleton, PreviewSkeleton } from "@thoth/components/generic/preview-skeleton"
import { ResourceGrid } from "@thoth/components/resource-grid"
import { RESPONSIVE_GRID } from "@thoth/components/responsive-grid"
import { QueryError } from "@thoth/components/status-page.tsx"
import { NameResource } from "@thoth/queries/queries"
import { useNameDetail } from "@thoth/queries/resources"
import { pluralize } from "@thoth/utils/utils"

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

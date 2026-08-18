import { LucideIcon } from "lucide-react"
import { FC } from "react"
import { Book } from "@thoth/client"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { DetailLayout } from "@thoth/components/detail/detail-layout"
import { PreviewSkeleton } from "@thoth/components/generic/preview-skeleton"
import { ResourceGrid } from "@thoth/components/resource-grid"
import { RESPONSIVE_GRID } from "@thoth/components/responsive-grid"
import { pluralize } from "@thoth/utils/utils"

export const NameBooks: FC<{ name: string; books: Book[]; icon: LucideIcon; round?: boolean }> = ({
  name,
  books,
  icon,
  round,
}) => (
  <DetailLayout title={name} fallbackIcon={icon} round={round} facts={[pluralize(books.length, "book")]}>
    <ResourceGrid
      listKey={`name-books:${name}`}
      total={books.length}
      itemAt={index => books[index]}
      listClassName={RESPONSIVE_GRID}
      renderItem={book => <BookPreview {...book} />}
      renderPlaceholder={() => <PreviewSkeleton subtitle />}
    />
  </DetailLayout>
)

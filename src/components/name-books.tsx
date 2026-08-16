import { LucideIcon } from "lucide-react"
import { FC } from "react"
import { Book } from "@thoth/client"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { DetailLayout } from "@thoth/components/detail/detail-layout"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { pluralize } from "@thoth/utils/utils"

export const NameBooks: FC<{ name: string; books: Book[]; icon: LucideIcon; round?: boolean }> = ({
  name,
  books,
  icon,
  round,
}) => (
  <DetailLayout title={name} fallbackIcon={icon} round={round} facts={[pluralize(books.length, "book")]}>
    <ResponsiveGrid>
      {books.map(book => (
        <ClearIfNotVisible key={book.id} component={BookPreview} childProps={book} />
      ))}
    </ResponsiveGrid>
  </DetailLayout>
)

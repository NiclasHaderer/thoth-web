import { FC } from "react"
import { Book } from "@thoth/client"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { ClearIfNotVisible } from "@thoth/components/clear-if-not-visible.tsx"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { pluralize } from "@thoth/utils/utils"

export const NameBooks: FC<{ name: string; books: Book[] }> = ({ name, books }) => (
  <>
    <div className="mb-4">
      <h2 className="truncate text-2xl font-bold">{name}</h2>
      <p className="text-muted-foreground text-xs md:text-sm">{pluralize(books.length, "book")}</p>
    </div>
    <ResponsiveGrid>
      {books.map(book => (
        <ClearIfNotVisible key={book.id} component={BookPreview} childProps={book} />
      ))}
    </ResponsiveGrid>
  </>
)

import { UUID } from "@/client"
import { BookPreview } from "@/components/book/book-preview.tsx"
import { HtmlViewer } from "@/components/html-editor"
import { ResponsiveGrid } from "@/components/responsive-grid"
import { isDetailedAuthor } from "@/models/typeguards"
import { useAuthor } from "@/queries/resources"
import { formatDate, pluralize } from "@/utils/utils.ts"
import { UserIcon } from "lucide-react"
import { FC, ReactNode } from "react"
import { DetailLayout, entityLink } from "@thoth/components/detail/detail-layout"
import AuthorEdit from "./author-edit"

export const AuthorDetails: FC<{ authorId: UUID; libraryId: UUID }> = ({ authorId, libraryId }) => {
  const { data: author } = useAuthor(libraryId, authorId)
  if (!author) return <></>

  const facts: ReactNode[] = []
  if (author.birthDate) facts.push(<span>Born {formatDate(author.birthDate)}</span>)
  if (author.deathDate) facts.push(<span>Died {formatDate(author.deathDate)}</span>)
  if (author.bornIn) facts.push(author.bornIn)

  return (
    <DetailLayout
      title={author.name}
      image={author.imageID ? `/api/stream/images/${author.imageID}` : undefined}
      fallbackIcon={UserIcon}
      round
      facts={facts}
      details={
        author.website ? (
          <a
            className={`text-sm ${entityLink}`}
            target="_blank"
            referrerPolicy="no-referrer"
            href={author.website.startsWith("http") ? author.website : `https://${author.website}`}
          >
            {author.website}
          </a>
        ) : null
      }
      actions={<AuthorEdit author={author} />}
    >
      {author.biography ? (
        <div className="pb-10">
          <HtmlViewer content={author.biography} title="Biography" collapsedLines={3} />
        </div>
      ) : null}

      {isDetailedAuthor(author) ? (
        <section>
          <h2 className="pb-3 text-xl">{pluralize(author.books.length, "Book")}</h2>
          <ResponsiveGrid>
            {author.books.map((book, k) => (
              <BookPreview {...book} key={k} />
            ))}
          </ResponsiveGrid>
        </section>
      ) : null}
    </DetailLayout>
  )
}
export default AuthorDetails

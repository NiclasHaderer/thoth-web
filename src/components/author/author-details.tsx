import { UUID } from "@/client"
import { BookPreview } from "@/components/book/book-preview.tsx"
import { HtmlViewer } from "@/components/html-editor"
import { ResponsiveGrid } from "@/components/responsive-grid"
import { isDetailedAuthor } from "@/models/typeguards"
import { useAuthor } from "@/queries/resources"
import { formatDate, pluralize } from "@/utils/utils.ts"
import { UserIcon } from "lucide-react"
import { FC, Fragment } from "react"
import { DetailLayout, detailLabel, entityLink } from "@thoth/components/detail/detail-layout"
import AuthorEdit from "./author-edit"

export const AuthorDetails: FC<{ authorId: UUID; libraryId: UUID }> = ({ authorId, libraryId }) => {
  const { data: author } = useAuthor(libraryId, authorId)
  if (!author) return <></>

  const born = author.birthDate ? formatDate(author.birthDate) : undefined
  const died = author.deathDate ? formatDate(author.deathDate) : undefined
  const lifespan = born && died ? `${born} - ${died}` : born ? `Born ${born}` : died ? `Died ${died}` : undefined

  const credits = [
    author.bornIn ? <span key="bornIn">Born in {author.bornIn}</span> : null,
    author.website ? (
      <a
        key="website"
        className={entityLink}
        target="_blank"
        referrerPolicy="no-referrer"
        href={author.website.startsWith("http") ? author.website : `https://${author.website}`}
      >
        {author.website}
      </a>
    ) : null,
  ].filter(Boolean)

  return (
    <DetailLayout
      title={author.name}
      image={author.imageID ? `/api/stream/images/${author.imageID}` : undefined}
      fallbackIcon={UserIcon}
      round
      subtitle={lifespan}
      credit={
        credits.length > 0 ? (
          <span className="flex flex-wrap items-center gap-x-2">
            {credits.map((credit, index) => (
              <Fragment key={index}>
                {index > 0 ? <span aria-hidden>&middot;</span> : null}
                {credit}
              </Fragment>
            ))}
          </span>
        ) : null
      }
      body={author.biography ? <HtmlViewer className="prose-sm" content={author.biography} collapsedLines={3} /> : null}
      actions={<AuthorEdit author={author} />}
    >
      {isDetailedAuthor(author) ? (
        <section>
          <h2 className={`${detailLabel} pb-3`}>{pluralize(author.books.length, "Book")}</h2>
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

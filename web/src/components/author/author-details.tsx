import { UUID } from "@/client"
import { BookPreview } from "@/components/book/book-preview.tsx"
import { HtmlViewer } from "@/components/html-editor"
import { ResponsiveGrid } from "@/components/responsive-grid"
import { isDetailedAuthor } from "@/models/typeguards"
import { useAuthor, useAutoMatchAuthor } from "@/queries/resources"
import { formatDate, pluralize } from "@/utils/utils.ts"
import { UserIcon } from "lucide-react"
import { FC, Fragment, useState } from "react"
import { useCoverSrc } from "@thoth/client/media"
import { DetailLayout, detailLabel, entityLink } from "@thoth/components/detail/detail-layout"
import { DetailSkeleton } from "@thoth/components/detail/detail-skeleton"
import { PartialSection } from "@thoth/components/detail/partial-section"
import { EditButton } from "@thoth/components/generic/edit-button"
import { PreviewGridSkeleton } from "@thoth/components/generic/preview-skeleton"
import { ResourceActions } from "@thoth/components/generic/resource-actions"
import { QueryError } from "@thoth/components/status-page.tsx"
import AuthorEdit from "./author-edit"

export const AuthorDetails: FC<{ authorId: UUID; libraryId: UUID }> = ({ authorId, libraryId }) => {
  const { data: author, error, refetch, isFetching, isLoadingError, isPending } = useAuthor(libraryId, authorId)
  const autoMatchAuthor = useAutoMatchAuthor()
  const [isEditing, setEditing] = useState(false)
  const cover = useCoverSrc()
  if (isLoadingError) return <QueryError error={error} onRetry={refetch} />
  if (isPending)
    return (
      <DetailSkeleton round>
        <PreviewGridSkeleton subtitle />
      </DetailSkeleton>
    )

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
      image={cover(author.imageID)}
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
      actions={
        <>
          <EditButton onPress={() => setEditing(true)} />
          <ResourceActions libraryId={libraryId} id={author.id} label="author" autoMatch={autoMatchAuthor} />
          <AuthorEdit author={author} isOpen={isEditing} onOpenChange={setEditing} />
        </>
      }
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
      ) : (
        <PartialSection title="Books" error={error} loading={isFetching} skeleton={<PreviewGridSkeleton subtitle />} />
      )}
    </DetailLayout>
  )
}
export default AuthorDetails

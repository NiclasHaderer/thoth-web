import { UserIcon } from "lucide-react"
import { FC, useEffect } from "react"
import { UUID } from "@thoth/client"
import { BookPreview } from "@thoth/components/book/book-preview.tsx"
import { HtmlViewer } from "@thoth/components/html-editor"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { isDetailedAuthor } from "@thoth/models/typeguards"
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { formatDate } from "../../utils/utils"
import AuthorEdit from "./author-edit"

export const AuthorDetails: FC<{ authorId: UUID; libraryId: UUID }> = ({ authorId, libraryId }) => {
  const author = useAudiobookState(AudiobookSelectors.selectAuthor(libraryId, authorId))
  const getAuthorDetails = useAudiobookState(s => s.fetchAuthorDetails)
  useEffect(() => void getAuthorDetails({ libraryId, id: authorId }), [authorId, libraryId, getAuthorDetails])
  if (!author) return <></>

  return (
    <>
      <div className="flex grow flex-col items-center pb-6">
        {author.imageID ? (
          <img
            className="border-border h-40 w-40 rounded-full border-2 object-contain md:h-80 md:w-80"
            alt={author.name}
            src={`/api/stream/images/${author.imageID}`}
            loading="lazy"
          />
        ) : (
          <UserIcon className="border-border h-40 w-40 rounded-full border-2 md:h-80 md:w-80" />
        )}
        <h2 className="flex items-center py-3 text-2xl">{author.name}</h2>
        {author.bornIn ? (
          <div className="flex pb-3">
            <h3 className="text-foreground min-w-40 pr-3 uppercase">Born in</h3>
            <h3>{author.bornIn}</h3>
          </div>
        ) : null}
        {author.birthDate ? (
          <div className="flex pb-3">
            <h3 className="text-foreground min-w-40 pr-3 uppercase">Born</h3>
            <h3>{formatDate(author.birthDate)}</h3>
          </div>
        ) : null}
        {author.deathDate ? (
          <div className="flex pb-3">
            <h3 className="text-foreground min-w-40 pr-3 uppercase">Died</h3>
            <h3>{formatDate(author.deathDate)}</h3>
          </div>
        ) : null}
        {author.website ? (
          <div className="flex pb-3">
            <h3 className="text-foreground min-w-40 pr-3 uppercase">Website</h3>
            <h3>
              <a
                className="hover:underline"
                target="_blank"
                referrerPolicy="no-referrer"
                href={author.website.startsWith("http") ? author.website : `https://${author.website}`}
              >
                {author.website}
              </a>
            </h3>
          </div>
        ) : null}
        <AuthorEdit author={author} />
      </div>

      <HtmlViewer content={author.biography} className="min-w-full pb-6" title="Biographie" />

      {isDetailedAuthor(author) ? (
        <>
          <h2 className="p-2 pb-6 text-2xl"> {author.books.length} Books</h2>
          <ResponsiveGrid>
            {author.books.map((book, k) => (
              <BookPreview {...book} key={k} />
            ))}
          </ResponsiveGrid>
        </>
      ) : null}

      <div className="p-10" />
    </>
  )
}
export default AuthorDetails

import React, { useEffect } from "react"
import { MdPerson } from "react-icons/md"

import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import AuthorEdit from "./author-edit"
import { formatDate } from "../../utils"
import { UUID } from "@thoth/models/api-models"
import { environment } from "@thoth/environment"
import { HtmlViewer } from "@thoth/components/html-viewer"
import { isDetailedAuthor } from "@thoth/models/typeguards"
import { ResponsiveGrid } from "@thoth/components/responsive-grid"
import { BookDisplay } from "@thoth/components/book/book"

export const AuthorDetails: React.FC<{ authorId: UUID }> = ({ authorId }) => {
  const libraryId = useAudiobookState(AudiobookSelectors.selectedLibraryId)!
  const author = useAudiobookState(AudiobookSelectors.selectAuthor(libraryId, authorId))
  const getAuthorDetails = useAudiobookState(AudiobookSelectors.fetchAuthorDetails)
  useEffect(() => void getAuthorDetails(libraryId, authorId), [authorId, libraryId, getAuthorDetails])
  if (!author) return <></>

  return (
    <>
      <div className="flex flex-grow flex-col items-center pb-6">
        {author.imageID ? (
          <img
            className="h-40 w-40 rounded-full border-2 border-active-light object-contain md:h-80 md:w-80"
            alt={author.name}
            src={`${environment.apiURL}/image/${author.imageID}`}
            loading="lazy"
          />
        ) : (
          <MdPerson className="h-40 w-40 rounded-full border-2 border-active-light md:h-80 md:w-80" />
        )}
        <h2 className="flex items-center py-3 text-2xl">{author.name}</h2>
        {author.bornIn ? (
          <div className="flex pb-3">
            <h3 className="min-w-40 pr-3 uppercase text-unimportant">Born in</h3>
            <h3>{author.bornIn}</h3>
          </div>
        ) : null}
        {author.birthDate ? (
          <div className="flex pb-3">
            <h3 className="min-w-40 pr-3 uppercase text-unimportant">Born</h3>
            <h3>{formatDate(author.birthDate)}</h3>
          </div>
        ) : null}
        {author.deathDate ? (
          <div className="flex pb-3">
            <h3 className="min-w-40 pr-3 uppercase text-unimportant">Died</h3>
            <h3>{formatDate(author.deathDate)}</h3>
          </div>
        ) : null}
        {author.website ? (
          <div className="flex pb-3">
            <h3 className="min-w-40 pr-3 uppercase text-unimportant">Website</h3>
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
        <AuthorEdit
          authorID={author.id}
          author={{
            name: author.name,
            providerID: author.providerID,
            provider: author.provider,
            image: author.imageID,
            birthDate: author.birthDate,
            deathDate: author.deathDate,
            bornIn: author.bornIn,
            website: author.website,
            biography: author.biography,
          }}
        />
      </div>
      <HtmlViewer content={author.biography} className="min-w-full pb-6" title="Biographie" />

      {isDetailedAuthor(author) ? (
        <>
          <h2 className="p-2 pb-6 text-2xl"> {author.books.length} Books</h2>
          <ResponsiveGrid>
            {author.books.map((book, k) => (
              <BookDisplay {...book} key={k} />
            ))}
          </ResponsiveGrid>
        </>
      ) : null}
    </>
  )
}
export default AuthorDetails

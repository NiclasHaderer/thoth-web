import React, { useCallback, useEffect } from "react"
import { MdPerson } from "react-icons/md"
import { useRoute } from "wouter"

import { environment } from "../../env"
import { AudiobookSelectors } from "../../state/audiobook.selectors"
import { useAudiobookState } from "../../state/audiobook.state"
import { isAuthorWithBooks } from "../../models/typeguards"
import { Book } from "../books/book"
import { HtmlViewer } from "../common/html-viewer"
import { ResponsiveGrid } from "../common/responsive-grid"
import AuthorEdit from "./author-edit"
import { formatDate } from "../../utils"

export const AuthorDetails: React.VFC = () => {
  const [, id] = useRoute("/authors/:id")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const author = useAudiobookState(useCallback(AudiobookSelectors.selectAuthor(id?.id), [id?.id]))
  const getAuthorDetails = useAudiobookState(AudiobookSelectors.fetchAuthorDetails)
  useEffect(() => void getAuthorDetails(id?.id!), [id?.id, getAuthorDetails])
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
        <AuthorEdit author={author} />
      </div>
      <HtmlViewer content={author.biography} className="min-w-full pb-6" title="Biographie" />

      {isAuthorWithBooks(author) ? (
        <>
          <h2 className="p-2 pb-6 text-2xl"> {author.books.length} Books</h2>
          <ResponsiveGrid>
            {author.books.map((book, k) => (
              <Book {...book} key={k} />
            ))}
          </ResponsiveGrid>
        </>
      ) : null}
    </>
  )
}
export default AuthorDetails

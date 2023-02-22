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
        <AuthorEdit author={author} />
      </div>
      <HtmlViewer content={author.biography} className="min-w-full pb-6" title="Biographie" />

      <h2 className="p-2 pb-6 text-2xl">Books</h2>
      <ResponsiveGrid>
        {(isAuthorWithBooks(author) ? author.books : []).map((book, k) => (
          <Book {...book} key={k} />
        ))}
      </ResponsiveGrid>
    </>
  )
}
export default AuthorDetails

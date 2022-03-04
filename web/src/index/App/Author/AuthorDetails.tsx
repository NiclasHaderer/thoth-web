import React, { useCallback, useEffect } from "react"
import { MdPerson } from "react-icons/md"
import { useRoute } from "wouter"

import { environment } from "../../env"
import { AudiobookSelectors } from "../../State/Audiobook.Selectors"
import { useAudiobookState } from "../../State/Audiobook.State"
import { isAuthorWithBooks } from "../../State/Audiobook.Typeguards"
import { Book } from "../Books/Book"
import { HtmlViewer } from "../Common/HtmlViewer"
import { ResponsiveGrid } from "../Common/ResponsiveGrid"
import AuthorEdit from "./AuthorEdit"

export const AuthorDetails: React.VFC = () => {
  const [, id] = useRoute("/authors/:id")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const author = useAudiobookState(useCallback(AudiobookSelectors.selectAuthor(id?.id), [id?.id]))
  const getAuthorDetails = useAudiobookState(AudiobookSelectors.fetchAuthorDetails)

  useEffect(() => getAuthorDetails(id?.id!), [id?.id, getAuthorDetails])
  if (!author) return <></>

  return (
    <>
      <div className="flex flex-grow flex-col items-center pb-6">
        {author.image ? (
          <img
            className="h-40 w-40 rounded-full border-2 border-light-active object-contain md:h-80 md:w-80"
            alt={author.name}
            src={`${environment.apiURL}/image/${author.image}`}
            loading="lazy"
          />
        ) : (
          <MdPerson className="h-40 w-40 rounded-full border-2 border-light-active md:h-80 md:w-80" />
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

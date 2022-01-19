import React, { useCallback, useEffect } from 'react';
import { MdPerson } from 'react-icons/md';
import { useRoute } from 'wouter';

import { environment } from '../../env';
import { AudiobookSelectors } from '../../State/Audiobook.Selectors';
import { useAudiobookState } from '../../State/Audiobook.State';
import { isAuthorWithBooks } from '../../State/Audiobook.Typeguards';
import { Book } from '../Books/Book';
import { HtmlViewer } from '../Common/HtmlViewer';
import { ResponsiveGrid } from '../Common/ResponsiveGrid';

export const AuthorDetails: React.VFC = () => {
  const [, id] = useRoute("/authors/:id")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const author = useAudiobookState(useCallback(AudiobookSelectors.selectAuthor(id?.id), [id?.id]))
  const getAuthorDetails = useAudiobookState(AudiobookSelectors.fetchAuthorDetails)

  useEffect(() => getAuthorDetails(id?.id!), [id?.id, getAuthorDetails])
  if (!author) return <></>

  return (
    <>
      <div className="flex flex-col pb-6 items-center flex-grow">
        {author.image ? (
          <img
            className="w-40 h-40 md:w-80 md:h-80 rounded-full object-contain border-2 border-light-active"
            alt={author.name}
            src={`${environment.apiURL}/image/${author.image}`}
            loading="lazy"
          />
        ) : (
          <MdPerson className="w-40 h-40 md:w-80 md:h-80 rounded-full border-2 border-light-active" />
        )}
        <h2 className="text-2xl py-3">{author.name}</h2>
      </div>
      <HtmlViewer content={author.biography} className="min-w-full pb-6" title="Biographie" />

      <ResponsiveGrid>
        {(isAuthorWithBooks(author) ? author.books : []).map((book, k) => (
          <Book {...book} key={k} />
        ))}
      </ResponsiveGrid>
    </>
  )
}

import { sanitize } from 'dompurify';
import React, { useCallback, useEffect } from 'react';
import { MdPerson } from 'react-icons/all';
import { useRoute } from 'wouter';
import { environment } from '../../env';
import { selectAuthor } from '../../State/Audiobook.Selectors';
import { useAudiobookState } from '../../State/Audiobook.State';
import { isAuthorWithBooks } from '../../State/Audiobook.Typeguards';
import { Book } from '../Books/Book';
import { ResponsiveImage } from '../Common/ResponsiveImage';

export const AuthorDetails: React.VFC = () => {
  const [, id] = useRoute('/authors/:id');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const author = useAudiobookState(useCallback(selectAuthor(id?.id), [id?.id]));
  const fetchAuthorDetails = useAudiobookState(s => s.fetchAuthorWithBooks);

  useEffect(() => fetchAuthorDetails(id?.id!), [id?.id, fetchAuthorDetails]);
  if (!author) return <></>;

  return (
    <>
      <div className="flex flex-col pb-6 items-center flex-grow">
        {author.image ?
          <ResponsiveImage className="w-40 h-40 md:w-80 md:h-80 rounded-full"
                           src={`${environment.apiURL}/image/${author.image}`}/>
          :
          <MdPerson className="w-40 h-40 md:w-80 md:h-80 rounded-full"/>
        }
        <h2 className="text-2xl py-3">{author.name}</h2>
      </div>
      <div className="prose w-full max-w-full text-current pb-6"
           dangerouslySetInnerHTML={{__html: sanitize(author.biography || '')}}
      />

      <div className="flex flex-wrap">
        {(isAuthorWithBooks(author) ? author.books : []).map((book, k) => <Book {...book} key={k}/>)}
      </div>
    </>
  );
};

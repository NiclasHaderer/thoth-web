import { sanitize } from 'dompurify';
import React, { useCallback, useEffect } from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { useRoute } from 'wouter';
import { environment } from '../../env';
import { getItemById } from '../../helpers';
import { useAudiobookState } from '../../State/AudiobookState';
import { Book } from '../Books/Book';

export const AuthorDetails: React.VFC = () => {
  const [, id] = useRoute('/authors/:id');
  const author = useAudiobookState(useCallback(({authors}) => getItemById(authors, id?.id), [id?.id]));
  const fetchAuthorDetails = useAudiobookState(s => s.fetchAuthorWithBooks);

  useEffect(() => fetchAuthorDetails(id?.id!), [id?.id, fetchAuthorDetails]);
  if (!author) return <></>;

  return (
    <>
      <div className="flex flex-col pb-6 items-center flex-grow">
        {author.image ?
          <img loading="lazy" className="min-w-80 max-w-80 rounded-full"
               src={`${environment.apiURL}/image/${author.image}`}
               alt="Artist"/> :
          <MdImageNotSupported
            className="min-w-80 h-80 max-w-80 rounded-full"/>
        }
        <h2 className="text-2xl py-3">{author.name}</h2>
      </div>
      <div className="prose w-full max-w-full text-current pb-6"
           dangerouslySetInnerHTML={{__html: sanitize(author.biography || '')}}
      />

      <div className="flex flex-wrap">
        {('books' in author ? author.books : []).map((book, k) => <Book {...book} key={k}/>)}
      </div>
    </>
  );
};

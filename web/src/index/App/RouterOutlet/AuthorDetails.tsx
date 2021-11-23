import { sanitize } from 'dompurify';
import React, { useEffect } from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { useRoute } from 'wouter';
import { environment } from '../../../env';
import { userState } from '../../state/state';
import { Book } from './shared/Book';

export const AuthorDetails: React.VFC = () => {
  const [, id] = useRoute('/authors/:id');
  const getAuthorDetails = userState(s => s.getAuthorWithBooks);
  const author = userState(s => s.authors[id?.id!]);

  useEffect(() => getAuthorDetails(id?.id!), [id?.id, getAuthorDetails]);
  if (!author) return <></>;

  return (
    <>
      <div className="flex flex-col pb-6 items-center flex-grow">
        {author.image ?
          <img className="min-w-80 max-w-80 rounded-full" src={`${environment.apiURL}/image/${author.image}`}
               alt="Cover"/> :
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

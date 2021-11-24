import { sanitize } from 'dompurify';
import React, { useCallback, useEffect } from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { useRoute } from 'wouter';
import { environment } from '../../env';
import { getItemById } from '../../helpers';
import { useAudiobookState } from '../../State/AudiobookState';
import { ALink } from '../Common/active-link';
import { Track } from '../Track/Track';

export const BookDetails = () => {
  const [, id] = useRoute('/books/:id');
  const getBookWithTracks = useAudiobookState(s => s.fetchBookWithTracks);
  const book = useAudiobookState(useCallback(({books}) => getItemById(books, id?.id), [id?.id]));

  useEffect(() => getBookWithTracks(id?.id!), [id?.id, getBookWithTracks]);
  if (!book) return <></>;

  return (
    <>
      <div className="flex pb-6">
        {book.cover ?
          <img loading="lazy" className="min-w-80 max-w-80 rounded-md" src={`${environment.apiURL}/image/${book.cover}`}
               alt="Book"/> :
          <MdImageNotSupported
            className="min-w-80 max-w-80 rounded-md"/>
        }
        <div className="flex-grow pl-10 ">
          <h2 className="text-2xl pb-3">{book.title}</h2>
          <h3 className="text-xl pb-3">___</h3>
          <div>
            <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Author</h3>
              <ALink href={`/authors/${book.author}`}>
                <h3 className="text-xl hover:underline">{book.author}</h3>
              </ALink>
            </div>
            {book.narrator ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Narrator</h3>
                <ALink href={`/authors/${book.narrator}`}>
                  <h3 className="text-xl hover:underline">{book.narrator}</h3>
                </ALink>
              </div>
              : ''}
            {book.series ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Series</h3>
                <ALink href={`/series/${book.series}`}>
                  <h3 className="text-xl hover:underline">{book.series}</h3>
                </ALink>
              </div>
              : ''}
            {book.seriesIndex ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Series Index</h3>
                <h3 className="text-xl hover:underline">{book.language}</h3>
              </div>
              : ''}
            {book.language ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Language</h3>
                <h3 className="text-xl">{book.language}</h3>
              </div>
              : ''}
          </div>
        </div>
      </div>
      <div className="prose w-full max-w-full text-current pb-6"
           dangerouslySetInnerHTML={{__html: sanitize(book.description || '')}}/>

      <div>
        {
          ('tracks' in book ? book.tracks : []).map((track, k) => <Track cover={book.cover} {...track} key={k}/>)
        }
      </div>
    </>
  );
};

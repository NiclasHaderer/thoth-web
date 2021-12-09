import { sanitize } from 'dompurify';
import React, { useCallback, useEffect } from 'react';
import { MdImageNotSupported, MdPlayCircle } from 'react-icons/md';

import { useRoute } from 'wouter';
import { BookModelWithTracks } from '../../API/Audiobook';
import { environment } from '../../env';
import { selectBook } from '../../State/Audiobook.Selectors';
import { useAudiobookState } from '../../State/Audiobook.State';
import { isBookWithTracks } from '../../State/Audiobook.Typeguards';
import { usePlaybackState } from '../../State/Playback';
import { ALink } from '../Common/ActiveLink';
import { ColoredButton } from '../Common/ColoredButton';
import { Track } from '../Track/Track';
import { BookedEdit } from './BookedEdit';

export const BookDetails = () => {
  const [, id] = useRoute('/books/:id');
  const getBookWithTracks = useAudiobookState(s => s.fetchBookWithTracks);
  const play = usePlaybackState(state => state.start);

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const book = useAudiobookState(useCallback(selectBook(id?.id), [id?.id]));

  useEffect(() => getBookWithTracks(id?.id!), [id?.id, getBookWithTracks]);
  if (!book) return <></>;

  const startPlayback = (position: number) => {
    const tracks = (book as BookModelWithTracks).tracks;

    const start = tracks[position];
    const queue = tracks.slice(position + 1, tracks.length);
    const history = tracks.slice(0, position);

    play(start, queue, history);
  };

  return (
    <>
      <div className="flex pb-6">
        <div className="flex flex-col justify-around">
          {book.cover ?
            <img className="w-40 h-40 md:w-80 object-contain md:h-80 rounded-md border-2 border-light-active"
                 alt={book.title}
                 src={`${environment.apiURL}/image/${book.cover}`}/>
            :
            <MdImageNotSupported className="w-40 h-40 md:w-80 md:h-80 rounded-md border-2 border-light-active"/>
          }
        </div>
        <div className="flex-grow pl-10 pl-4 md:pl-10 flex-col flex justify-between">
          <div>
            <h2 className="text-2xl pb-3">{book.title}</h2>
            {book.year ? <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Year</h3>
              <h3>{book.year}</h3>
            </div> : null}
            <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Author</h3>
              <ALink href={`/authors/${book.author.id}`}>
                <h3
                  className="group-focus:underline group-focus:underline group-focus:underline  hover:underline focus:underline">{book.author.name}</h3>
              </ALink>
            </div>
            {book.narrator ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Narrator</h3>
                <h3>{book.narrator}</h3>
              </div>
              : ''}
            {book.series ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Series</h3>
                <ALink href={`/series/${book.series.id}`}>
                  <h3 className="group-focus:underline hover:underline">{book.series.title}</h3>
                </ALink>
              </div>
              : ''}
            {book.seriesIndex ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Series Index</h3>
                <h3>{book.seriesIndex}</h3>
              </div>
              : ''}
            {book.language ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Language</h3>
                <h3>{book.language}</h3>
              </div>
              : ''}
          </div>
          <div className="mt-2">
            <ColoredButton className="mr-3" onClick={() => startPlayback(0)}>
              <MdPlayCircle className="mr-2"/> Play
            </ColoredButton>
            <BookedEdit book={book}/>
          </div>
        </div>
      </div>
      <div className="prose w-full max-w-full text-current pb-6"
           dangerouslySetInnerHTML={{__html: sanitize(book.description || '')}}/>
      <div>
        <h3 className="p-2 text-xl pb-6">{isBookWithTracks(book) ? book.tracks.length : ''} Tracks</h3>
        {
          (isBookWithTracks(book) ? book.tracks : []).map((track, k) => <Track startPlayback={startPlayback} {...track}
                                                                               key={k} index={k}/>)
        }
      </div>
    </>
  );
};

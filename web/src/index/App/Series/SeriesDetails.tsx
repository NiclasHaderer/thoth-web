import { sanitize } from 'dompurify';
import React, { useCallback, useEffect } from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { useRoute } from 'wouter';
import { getItemById } from '../../helpers';
import { useAudiobookState } from '../../State/AudiobookState';
import { Book } from '../Books/Book';
import { ALink } from '../Common/active-link';

export const SeriesDetails: React.VFC = () => {
  const [, id] = useRoute('/series/:id');
  const getSeriesWithBooks = useAudiobookState(s => s.fetchSeriesWithBooks);
  const series = useAudiobookState(useCallback(({series}) => getItemById(series, id?.id), [id?.id]));

  useEffect(() => getSeriesWithBooks(id?.id!), [id?.id, getSeriesWithBooks]);
  if (!series) return <></>;

  return (
    <>
      <div className="flex pb-6">
        <MdImageNotSupported
          className="min-w-80 max-w-80 h-80 rounded-md"/>
        <div className="flex-grow pl-10 ">
          <h2 className="text-2xl pb-3">{series.title}</h2>
          <h3 className="text-xl pb-3">Year: ___</h3>
          <div>
            <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Author</h3>
              <ALink href={`/authors/${series.author}`}>
                <h3 className="text-xl hover:underline">{series.author}</h3>
              </ALink>
            </div>
            <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Narrators</h3>
              <ALink href={`/authors/___`}>
                <h3 className="text-xl hover:underline">___</h3>
              </ALink>
              <span className="px-1">,</span>
              <ALink href={'/authors/___'}>
                <h3 className="text-xl hover:underline">___</h3>
              </ALink>
            </div>
            <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Books</h3>
              <h3 className="text-xl">___</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="prose w-full max-w-full text-current pb-6"
           dangerouslySetInnerHTML={{__html: sanitize(series.description || '')}}/>

      {('books' in series ? series.books : []).map((book, k) =>
        <Book {...book} key={k}/>)}
    </>
  );
};

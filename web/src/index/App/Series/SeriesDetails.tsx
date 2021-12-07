import { sanitize } from 'dompurify';
import React, { useCallback, useEffect } from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { useRoute } from 'wouter';
import { selectSeries } from '../../State/Audiobook.Selectors';
import { useAudiobookState } from '../../State/Audiobook.State';
import { isSeriesWithBooks } from '../../State/Audiobook.Typeguards';
import { Book } from '../Books/Book';
import { ALink } from '../Common/ActiveLink';
import { ResponsiveGrid } from '../Common/ResponsiveGrid';

export const SeriesDetails: React.VFC = () => {
  const [, id] = useRoute('/series/:id');
  const getSeriesWithBooks = useAudiobookState(s => s.fetchSeriesWithBooks);
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const series = useAudiobookState(useCallback(selectSeries(id?.id), [id?.id]));

  useEffect(() => getSeriesWithBooks(id?.id!), [id?.id, getSeriesWithBooks]);
  if (!series) return <></>;

  return (
    <>
      <div className="flex pb-6">
        <div className="flex flex-col justify-around">
          <MdImageNotSupported
            className="w-40 h-40 md:w-80 md:h-80 rounded-md"/>
        </div>
        <div className="flex-grow pl-10 pl-4 md:pl-10">
          <h2 className="text-2xl pb-3">{series.title}</h2>
          {isSeriesWithBooks(series) && series.yearRange ?
            <h3 className="text-xl pb-3">{series.yearRange.start} - {series.yearRange.end}</h3>
            : ''}
          <div>
            <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Author</h3>
              <ALink href={`/authors/${series.author.id}`}>
                <h3 className="text-xl group-focus:underline  hover:underline">{series.author.name}</h3>
              </ALink>
            </div>
            {isSeriesWithBooks(series) && series.narrators.length > 0 ?
              <div className="flex pb-3">
                <h3 className="uppercase text-unimportant pr-3 min-w-40">Narrators</h3>
                <div className="flex flex-wrap">
                  {series.narrators.map((narrator, i) => (
                    <h3 className="text-xl pr-2" key={i}>
                      {narrator} {series.narrators.length === i + 1 ? null : ','}
                    </h3>
                  ))
                  }
                </div>
              </div>
              : ''}

            <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Books</h3>
              <h3 className="text-xl">{series.amount}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="prose w-full max-w-full text-current pb-6"
           dangerouslySetInnerHTML={{__html: sanitize(series.description || '')}}/>

      {isSeriesWithBooks(series) ?
        <>
          <h2 className="p-2 pb-6 text-xl">
            {series.books.length} Books
          </h2>
          <ResponsiveGrid>
            {series.books.map((book, k) => <Book {...book} key={k}/>)}
          </ResponsiveGrid>
        </>
        : null}

    </>
  );
};

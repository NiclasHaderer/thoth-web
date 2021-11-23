import { sanitize } from 'dompurify';
import React, { useEffect } from 'react';
import { useRoute } from 'wouter';
import { userState } from '../../state/state';
import { ALink } from '../shared/active-link';
import { Book } from './shared/Book';

export const SeriesDetails: React.VFC = () => {
  const [, id] = useRoute('/series/:id');
  const getSeriesWithBooks = userState(s => s.getSeriesWithBooks);
  const series = userState(s => s.series[id?.id!]);

  // TODO infinite fetch
  useEffect(() => getSeriesWithBooks(id?.id!), [id, getSeriesWithBooks]);
  if (!series) return <></>;


  return (
    <>
      <div className="flex pb-6">
        <img className="min-w-80 max-w-80 rounded-md" src="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg"
             alt="Cover"/>
        <div className="flex-grow pl-10 ">
          <h2 className="text-2xl pb-3">{series.title}</h2>
          <h3 className="text-xl pb-3">Year: ___</h3>
          <div>
            <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Author</h3>
              <ALink href={'/authors/asdf'}>
                <h3 className="text-xl hover:underline">{series.author}</h3>
              </ALink>
            </div>
            <div className="flex pb-3">
              <h3 className="uppercase text-unimportant pr-3 min-w-40">Narrators</h3>
              <ALink href={'/authors/asdf'}>
                <h3 className="text-xl hover:underline">___</h3>
              </ALink>
              <span className="px-1">,</span>
              <ALink href={'/authors/asdf'}>
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

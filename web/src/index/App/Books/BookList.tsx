import React, { useRef } from 'react';
import { useInfinityScroll } from '../../Hooks/InfinityScroll';
import { useScrollToTop } from '../../Hooks/ScrollToTop';
import { AudiobookSelectors } from '../../State/Audiobook.Selectors';
import { useAudiobookState } from '../../State/Audiobook.State';
import { ResponsiveGrid } from '../Common/ResponsiveGrid';
import { Book } from './Book';

export const BookList: React.VFC = () => {
  const getBooks = useAudiobookState(AudiobookSelectors.fetchBooks);
  const loading = useRef<HTMLDivElement>(null);
  useScrollToTop('main');
  useInfinityScroll(loading.current, getBooks);
  const books = useAudiobookState(AudiobookSelectors.selectBooks);

  return (
    <ResponsiveGrid>
      {books.map((book, k) =>
        <Book {...book} key={k}/>)}
      <div className="min-w-full text-center opacity-0" ref={loading}>Loading ...</div>
    </ResponsiveGrid>
  );
};


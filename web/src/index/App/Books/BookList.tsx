import React, { useRef } from 'react';
import { useInfinityScroll } from '../../Hooks/InfinityScroll';
import { useScrollToTop } from '../../Hooks/ScrollToTop';
import { useAudiobookState } from '../../State/AudiobookState';
import { Book } from './Book';

export const BookList: React.VFC = () => {
  const getBooks = useAudiobookState(s => s.fetchBooks);
  const loading = useRef<HTMLDivElement>(null);
  useScrollToTop('main');
  useInfinityScroll(loading.current, getBooks);
  const books = useAudiobookState(s => s.books);

  return <div className="flex flex-wrap">
    {books.map((book, k) =>
      <Book  {...book} key={k}/>)}
    <div className="min-w-full text-center" ref={loading}>Loading ...</div>
  </div>;
};


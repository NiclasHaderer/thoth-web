import React, { useRef } from 'react';
import { useInfinityScroll } from '../../Hooks/InfinityScroll';
import { useScrollToTop } from '../../Hooks/ScrollToTop';
import { useAudiobookState } from '../../State/AudiobookState';
import { ResponsiveGrid } from '../Common/ResponsiveGrid';
import { Author } from './Author';

export const AuthorList: React.VFC = () => {
  const getAuthors = useAudiobookState(s => s.fetchAuthors);
  const loading = useRef<HTMLDivElement>(null);
  useScrollToTop('main');
  useInfinityScroll(loading.current, getAuthors);

  const authors = useAudiobookState(s => s.authors);
  return (
    <ResponsiveGrid>
      {authors.map((author, k) =>
        <Author {...author} key={k}/>)}
      <div className="min-w-full text-center" ref={loading}>Loading ...</div>
    </ResponsiveGrid>
  );
};

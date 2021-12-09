import React, { useRef } from 'react';
import { useInfinityScroll } from '../../Hooks/InfinityScroll';
import { useScrollToTop } from '../../Hooks/ScrollToTop';
import { selectSeriesList } from '../../State/Audiobook.Selectors';
import { useAudiobookState } from '../../State/Audiobook.State';
import { ResponsiveGrid } from '../Common/ResponsiveGrid';
import { Series } from './Series';

export const SeriesList: React.VFC = () => {
  const getSeries = useAudiobookState(s => s.fetchSeries);
  const series = useAudiobookState(selectSeriesList);
  const loading = useRef<HTMLDivElement>(null);
  useScrollToTop('main');
  useInfinityScroll(loading.current, getSeries);


  return (
    <ResponsiveGrid>
      {series.map((series, k) =>
        <Series {...series} key={k}/>)}
      <div className="min-w-full text-center opacity-0" ref={loading}>Loading ...</div>
    </ResponsiveGrid>
  );
};

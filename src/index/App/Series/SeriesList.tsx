import React, { useRef } from 'react';
import { useInfinityScroll } from '../../Hooks/InfinityScroll';
import { useScrollToTop } from '../../Hooks/ScrollToTop';
import { useAudiobookState } from '../../State/AudiobookState';
import { ResponsiveGrid } from '../Common/ResponsiveGrid';
import { Series } from './Series';

export const SeriesList: React.VFC = () => {
  const series = useAudiobookState(s => s.series);
  const getSeries = useAudiobookState(s => s.fetchSeries);
  const loading = useRef<HTMLDivElement>(null);
  useScrollToTop('main');
  useInfinityScroll(loading.current, getSeries);


  return (
    <ResponsiveGrid>
    {series.map((series, k) =>
      <Series {...series} key={k}/>)}
    <div className="min-w-full text-center" ref={loading}>Loading ...</div>
  </ResponsiveGrid>
  );
};

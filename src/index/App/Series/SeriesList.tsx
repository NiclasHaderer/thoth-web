import React, { useRef } from 'react';
import { useInfinityScroll } from '../../Hooks/InfinityScroll';
import { useScrollToTop } from '../../Hooks/ScrollToTop';
import { useAudiobookState } from '../../State/AudiobookState';
import { Series } from './Series';

export const SeriesList: React.VFC = () => {
  const series = useAudiobookState(s => s.series);
  const getSeries = useAudiobookState(s => s.fetchSeries);
  const loading = useRef<HTMLDivElement>(null);
  useScrollToTop('main');
  useInfinityScroll(loading.current, getSeries);


  return <div className="flex flex-wrap">
    {series.map((series, k) =>
      <Series {...series} key={k}/>)}
    <div className="min-w-full text-center" ref={loading}>Loading ...</div>
  </div>;
};

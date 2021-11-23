import React, { useEffect } from 'react';
import { userState } from '../../state/state';
import { Series } from './Series/Series';

export const SeriesCollection: React.VFC = () => {

  const series = userState(s => Object.values(s.series));
  const getSeries = userState(s => s.getSeries);
  useEffect(getSeries, [getSeries]);


  return <>
    {series.map((series, k) =>
      <Series {...series} key={k}/>)}
  </>;
};

import React from 'react';
import { Collection } from './Collection';

export const Collections: React.VFC = () => {
  return <>
    {new Array(60).fill(null).map((v, k) =>
      <Collection id="iii" image="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg" key={k}
                  amount={7} name="Harry Potter"/>)}
  </>;
};

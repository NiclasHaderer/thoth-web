import React from 'react';
import { Author } from './Author';

export const Authors: React.VFC = () => {
  return <>
    {new Array(60).fill(null).map((v, k) =>
      <Author id="iii" image="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg" key={k}
              name={'J.K. Rowling'}/>)}
  </>;
};

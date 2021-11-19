import React from 'react';
import { Book } from './Book';

export const Books: React.VFC = () => {
  return <>
    {new Array(60).fill(null).map((v, k) =>
      <Book id="iii" image="https://m.media-amazon.com/images/I/517WcD5gWeL.jpg" key={k}
            author={{name: 'J.K. Rowling', id: 'asdf'}}
            title="Harry Potter and the Chamber of Secretsand the Chamber of Secrets"/>)}
  </>;
};

import React, { useEffect } from 'react';
import { userState } from '../../state/state';
import { Book } from './shared/Book';

export const Books: React.VFC = () => {
  const getBooks = userState(s => s.getBooks);
  useEffect(getBooks, [getBooks]);

  const books = userState(s => Object.values(s.books));

  return <>
    {books.map((book, k) =>
      <Book  {...book} key={k}/>)}
  </>;
};

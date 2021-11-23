import React, { useEffect } from 'react';
import { userState } from '../../state/state';
import { Author } from './shared/Author';

export const AuthorList: React.VFC = () => {
  const getAuthors = userState(s => s.getAuthors);
  useEffect(getAuthors, [getAuthors]);
  const authors = userState(s => Object.values(s.authors));
  return <div className="flex flex-wrap">
    {authors.map((author, k) =>
      <Author {...author} key={k}/>)}
  </div>;
};

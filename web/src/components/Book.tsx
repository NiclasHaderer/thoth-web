import React from 'react';
import { ALink } from '../utils/active-link';

interface BookProps {
  id: string;
  image: string;
  title: string;
  author: {
    name: string,
    id: string
  };
}

export const Book: React.VFC<BookProps> = ({image, title, author, id}) => {
  return (
    <span
      className="mx-6 mb-6 inline-block w-52 ">
  <ALink href={`/books/${id}`}>
      <img className="w-53 h52 rounded-md border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors" src={image} alt="asd"/>

  </ALink>

      <div className="p-2 relative">

        <ALink href={`/books/${id}`}>
        <span className="cursor-pointer two-lines hover:underline">{title}</span>
        </ALink>
        <ALink href={`/authors/${author.id}`}>
        <span className="text-unimportant  hover:underline cursor-pointer">{author.name}</span>
        </ALink>
      </div>
    </span>);
};

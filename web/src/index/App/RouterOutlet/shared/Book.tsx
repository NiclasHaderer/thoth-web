import React from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { environment } from '../../../../env';
import { ALink } from '../../shared/active-link';

interface BookProps {
  id: string;
  cover: string | null;
  title: string;
  author: string;
}

export const Book: React.VFC<BookProps> = ({cover, title, author, id}) => {
  return (
    <span
      className="mx-6 mb-6 inline-block w-52 ">
  <ALink href={`/books/${id}`}>
     {cover ? <img
         className="w-52 h-52 rounded-md border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"
         src={`${environment.apiURL}/image/${cover}`} alt="asd"/> :
       <MdImageNotSupported
         className="w-52 h-52 rounded-md border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"/>
     }

  </ALink>

      <div className="p-2 relative">

        <ALink href={`/books/${id}`}>
        <span className="cursor-pointer line-clamp-2 hover:underline">{title}</span>
        </ALink>
        <ALink href={`/authors/${author}`}>
        <span className="text-unimportant  hover:underline cursor-pointer">{author}</span>
        </ALink>
      </div>
    </span>);
};

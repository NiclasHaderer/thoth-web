import React from 'react';
import { MdImageNotSupported } from 'react-icons/md';

import { NamedId } from '../../API/Audiobook';
import { environment } from '../../env';
import { ALink } from '../Common/ActiveLink';

interface BookProps {
  id: string;
  cover: string | null;
  title: string;
  author: NamedId;
}

export const Book: React.VFC<BookProps> = ({cover, title, author, id}) => {
  return (
    <div className="mx-6 mb-6 inline-block w-52">
      <ALink href={`/books/${id}`} aria-label={title} tabIndex={-1}>
        {cover ?
          <img
            className="w-52 object-cover h-52 rounded-md border-2 cursor-pointer hover:border-primary border-transparent transition-colors"
            src={`${environment.apiURL}/image/${cover}`} alt={title} loading="lazy"/>
          :
          <MdImageNotSupported
            className="w-52 h-52 rounded-md border-2 cursor-pointer hover:border-primary border-transparent transition-colors"/>
        }

      </ALink>

      <div className="p-2 relative text-center">

        <ALink href={`/books/${id}`}>
          <span className="cursor-pointer line-clamp-2 hover:underline group-focus:underline ">{title}</span>
        </ALink>
        <ALink href={`/authors/${author.id}`}>
          <span className="text-unimportant group-focus:underline  hover:underline cursor-pointer">{author.name}</span>
        </ALink>
      </div>
    </div>);
};

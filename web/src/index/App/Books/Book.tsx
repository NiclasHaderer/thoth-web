import React from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { environment } from '../../env';
import { NamedId } from '../../API/Audiobook';
import { ALink } from '../Common/ActiveLink';
import { ResponsiveImage } from '../Common/ResponsiveImage';

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
            <ResponsiveImage
              className="w-52 h-52 rounded-xl border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"
              src={`${environment.apiURL}/image/${cover}`}/>
          :
          <MdImageNotSupported
            className="w-52 h-52 rounded-md border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"/>
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

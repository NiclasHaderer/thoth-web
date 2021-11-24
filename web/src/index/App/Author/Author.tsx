import React from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { ALink } from '../Common/active-link';

interface AuthorProps {
  image: string | null;
  name: string;
  id: string;
}


export const Author: React.VFC<AuthorProps> = ({image, name, id}) => {
  return (
    <span
      className="mx-6 mb-6 inline-block w-52 min-w-52">
  <ALink href={`/authors/${id}`}>
    {image ?
      <img loading="lazy"
           className="w-52 h-52 rounded-full border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"
           src={image || ''} alt="Author"/> :
      <MdImageNotSupported
        className="w-52 h-52 rounded-full border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"/>

    }

  </ALink>

      <div className="p-2 relative text-center">
        <ALink href={`/authors/${id}`}>
        <span className="hover:underline cursor-pointer">{name}</span>
        </ALink>
      </div>
    </span>);
};

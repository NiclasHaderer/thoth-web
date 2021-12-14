import React from 'react';
import { MdPerson } from 'react-icons/md';
import { environment } from '../../env';
import { ALink } from '../Common/ActiveLink';

interface AuthorProps {
  image: string | null;
  name: string;
  id: string;
  className?: string;
}


export const Author: React.VFC<AuthorProps> = ({image, name, id, className}) => {
  return (
    <div className={`mx-6 mb-6 inline-block w-52 min-w-52 ${className}`}>
      <ALink href={`/authors/${id}`} aria-label={name} tabIndex={-1}>
        {image ?
          <img loading="lazy"
               className="w-52 h-52 object-cover  rounded-full border-2 cursor-pointer hover:border-primary border-light-active transition-colors"
               src={`${environment.apiURL}/image/${image}`} alt="Author"/> :
          <MdPerson
            className="w-52 h-52 rounded-full border-2 cursor-pointer hover:border-primary border-light-active border-transparent transition-colors"/>
        }
      </ALink>

      <div className="p-2 relative text-center">
        <ALink href={`/authors/${id}`}>
          <span className="group-focus:underline hover:underline cursor-pointer">{name}</span>
        </ALink>
      </div>
    </div>);
};

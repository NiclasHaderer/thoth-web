import React from 'react';
import { MdPerson } from 'react-icons/all';
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
      <ALink href={`/authors/${id}`} label={name}>
        {image ?
          <img loading="lazy"
               className="w-52 h-52 rounded-full border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"
               src={`${environment.apiURL}/image/${image}`} alt="Author"/> :
          <MdPerson
            className="w-52 h-52 rounded-full border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"/>

        }

      </ALink>

      <div className="p-2 relative text-center">
        <ALink href={`/authors/${id}`}>
          <span className="hover:underline cursor-pointer">{name}</span>
        </ALink>
      </div>
    </div>);
};
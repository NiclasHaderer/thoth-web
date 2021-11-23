import React from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { ALink } from '../../shared/active-link';


interface CollectionProps {
  id: string;
  amount?: number;
  title: string;
  cover?: string;
}

export const Series: React.VFC<CollectionProps> = ({id, title, amount, cover}) => {
  return (
    <span
      className="mx-6 mb-6 inline-block w-52 ">
    <ALink href={`/series/${id}`}>
       {cover ? <img
           className="w-52 h-52 rounded-md border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"
           src={cover} alt="asd"/> :
         <MdImageNotSupported
           className="w-52 h-52 rounded-md border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"/>
       }
    </ALink>

      <div className="p-2 relative">
        <ALink href={`/series/${id}`}>
        <span className="cursor-pointer line-clamp-2 hover:underline">{title}</span>
        </ALink>
        <span className="text-unimportant">{amount} Audiobooks</span>
      </div>
    </span>);

};

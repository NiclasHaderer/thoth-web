import React from 'react';
import { ALink } from '../../shared/active-link';


interface CollectionProps {
  id: string;
  amount: number;
  name: string;
  image: string;
}

export const Collection: React.VFC<CollectionProps> = ({id, name, amount, image}) => {
  return (
    <span
      className="mx-6 mb-6 inline-block w-52 ">
    <ALink href={`/collections/${id}`}>
        <img
          className="w-53 h52 rounded-md border-1.5 cursor-pointer hover:border-primary border-transparent transition-colors"
          src={image} alt="asd"/>
    </ALink>

      <div className="p-2 relative">
        <ALink href={`/collections/${id}`}>
        <span className="cursor-pointer line-clamp-2 hover:underline">{name}</span>
        </ALink>
        <span className="text-unimportant">{amount} Audiobooks</span>
      </div>
    </span>);

};

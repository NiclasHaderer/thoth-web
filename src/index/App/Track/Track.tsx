import React from 'react';
import { MdImageNotSupported } from 'react-icons/all';
import { environment } from '../../env';
import { ALink } from '../Common/active-link';
import { toReadableTime } from './helpers';

interface TrackProps {
  cover: string | null;
  title: string;
  author: string;
  duration: number;
  trackNr: number | null;
}

export const Track: React.VFC<TrackProps> = ({cover, title, duration, trackNr, author}) => (
  <div className="flex odd:bg-light-active p-2 mr-3 rounded-md">
    {cover ?
      <img loading="lazy" className="w-16 h-16 rounded-md" alt="Track" src={`${environment.apiURL}/image/${cover}`}/> :
      <MdImageNotSupported className="w-16 h-16 rounded-md"/>
    }
    <div className="pl-6 flex flex-grow items-center justify-between">
      <div className="flex items-center">
        {trackNr}
        <div className="pl-6 flex flex-col">
          <span>{title}</span>
          <ALink href={`/authors${author}`}>
            <span className="cursor-pointer hover:underline">{author}</span>
          </ALink>
        </div>
      </div>
      {toReadableTime(duration)}
    </div>
  </div>
);

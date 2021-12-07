import React from 'react';
import { MdImageNotSupported, MdPlayCircle } from 'react-icons/md';
import { environment } from '../../env';
import { NamedId } from '../../API/Audiobook';
import { ALink } from '../Common/ActiveLink';
import { ResponsiveImage } from '../Common/ResponsiveImage';
import { toReadableTime } from './helpers';

interface TrackProps {
  cover: string | null;
  title: string;
  author: NamedId;
  duration: number;
  index: number;
  trackNr: number | null;
  startPlayback: (index: number) => void;
}

export const Track: React.VFC<TrackProps> = ({cover, title, duration, trackNr, index, author, startPlayback}) => (
  <div className="flex even:bg-light-active p-2 mr-3 rounded-md">
    <div className="relative group cursor-pointer" onClick={() => startPlayback(index)}
         onKeyUp={e => e.key === 'Enter' && startPlayback(index)}>
      {cover ?
        <ResponsiveImage className="w-16 h-16 rounded-md" src={`${environment.apiURL}/image/${cover}`}/>
        :
        <MdImageNotSupported className="w-16 h-16 rounded-md"/>
      }
      <button
        className="h-6 w-6 absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100">
        <MdPlayCircle className="w-full h-full"/>
      </button>
    </div>
    <div className="pl-6 flex flex-grow items-center justify-between">
      <div className="flex items-center">
        {trackNr}
        <div className="pl-6 flex flex-col">
          <span>{title}</span>
          <ALink href={`/authors/${author.id}`} tabIndex={-1}>
            <span className="cursor-pointer group-focus:underline hover:underline">{author.name}</span>
          </ALink>
        </div>
      </div>
      {toReadableTime(duration)}
    </div>
  </div>
);

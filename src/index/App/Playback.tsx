import React from 'react';
import { MdImageNotSupported, MdPauseCircle, MdSkipNext, MdSkipPrevious, MdStop } from 'react-icons/md';
import { environment } from '../env';
import { usePlaybackState } from '../State/Playback';
import { ALink } from './Common/ActiveLink';
import { ResponsiveImage } from './Common/ResponsiveImage';

export const Playback: React.VFC = () => {
  const playback = usePlaybackState();
  const track = playback.current;
  if (!track) return <></>;


  return <div className="p-3 flex bg-elevate justify-between">

    <ALink href={`/books/${track.book.id}`}>
      {track.cover ?
        <ResponsiveImage className="w-10 h-10 md:w-20 md:h-20 rounded-md"
                         src={`${environment.apiURL}/image/${track.cover}`}/>
        :
        <MdImageNotSupported className="w-40 h-40 md:w-80 md:h-80 rounded-md"/>
      }
    </ALink>
    <div className="flex flex-col justify-around">
      {track.trackNr ? track.trackNr + '. ' : null} {track.title}
      <div>
        <ALink className="hover:underline pr-2" href={`/authors/${track.author.id}`}>{track.author.name}</ALink>-
        <ALink className="hover:underline pl-2" href={`/books/${track.book.id}`}>{track.book.title}</ALink>
      </div>
    </div>


    <div className="flex items-center">
      <MdSkipPrevious className="w-8 h-8 m-2 cursor-pointer" onClick={playback.previous}/>
      <MdPauseCircle className="w-8 h-8 m-2 cursor-pointer" onClick={() => null}/>
      <MdSkipNext className="w-8 h-8 m-2 cursor-pointer" onClick={playback.next}/>
      <MdStop className="w-8 h-8 m-2 cursor-pointer" onClick={playback.stop}/>
    </div>
  </div>;
};

import React, { useEffect, useRef } from 'react';
import { MdImageNotSupported, MdPauseCircle, MdPlayCircle, MdSkipNext, MdSkipPrevious, MdStop } from 'react-icons/md';
import { environment } from '../env';
import { useAudio, useDuration, useOnEnded, usePercentage, usePlayState, usePosition } from '../Hooks/Playback';
import { usePlaybackState } from '../State/Playback';
import { ALink } from './Common/ActiveLink';
import { ProgressBar } from './Common/ProgressBar';
import { toReadableTime } from './Track/helpers';

export const Playback: React.VFC<{className?:string}> = ({className}) => {
  const playback = usePlaybackState();
  const track = playback.current;

  const [audio] = useAudio(track?.id ? `${environment.apiURL}/audio/${track!.id}` : undefined);
  const [position] = usePosition(audio);
  const duration = useDuration(audio);
  const initialFocus = useRef<HTMLButtonElement>(null);
  const [percentage, setPercentage] = usePercentage(audio);
  const [playing, setPlaying] = usePlayState(audio);
  useOnEnded(audio, playback.next);

  useEffect(() => {
    initialFocus.current && initialFocus.current.focus();
  }, [initialFocus]);

  if (!track) return <></>;


  return (
    <div className={`p-3 flex bg-elevate justify-between relative ${className}`}>

      <ProgressBar className="absolute top-0 left-0 right-0 w-full -translate-y-1/2"
                   percentage={percentage} onChange={setPercentage}/>

      <div className="flex items-center">
        <ALink href={`/books/${track.book.id}`} className="mr-3" aria-label={track.title} tabIndex={-1}>
          {track.cover ?
            <img className="w-10 h-10 md:w-20 md:h-20 rounded-md" alt={track.title} loading="lazy"
                 src={`${environment.apiURL}/image/${track.cover}`}/>
            :
            <MdImageNotSupported className="w-10 h-10 md:w-20 md:h-20 rounded-md"/>
          }
        </ALink>

        <div className="flex flex-col justify-around">
          {track.trackNr ? track.trackNr + '. ' : null} {track.title}
          <div>
            <ALink className="focus:underline hover:underline pr-2"
                   href={`/authors/${track.author.id}`}>{track.author.name}</ALink>-
            <ALink className="focus:underline hover:underline pl-2"
                   href={`/books/${track.book.id}`}>{track.book.title}</ALink>
          </div>
        </div>
      </div>

      <div className="items-center hidden md:flex">
        <span className="pr-2">{toReadableTime(position)}</span>:
        <span className="pl-2">{toReadableTime(duration)}</span>
      </div>

      <audio/>
      <div className="flex items-center">
        <button onClick={playback.previous} disabled={playback.history.length === 0}
                className={`w-10 h-10 p-1 focus:bg-light-active rounded-full ${playback.history.length === 0 ? 'text-elevate' : ''}`}>
          <MdSkipPrevious className="w-full h-full"/>
        </button>
        <button className="w-10 h-10 p-1 focus:bg-light-active rounded-full"
                onClick={() => setPlaying(!playing)} ref={initialFocus}
        >
          {playing ?
            <MdPauseCircle className="w-full h-full"/>
            :
            <MdPlayCircle className="w-full h-full"/>}
        </button>
        <button onClick={playback.next} disabled={playback.queue.length === 0}
                className={`w-10 h-10 p-1 focus:bg-light-active rounded-full ${playback.queue.length === 0 ? 'text-elevate' : ''}`}>
          <MdSkipNext className="w-full h-full"
          />
        </button>
        <button onClick={playback.stop}
                className="w-10 h-10 p-1 focus:bg-light-active rounded-full">
          <MdStop className="w-full h-full"/>
        </button>
      </div>
    </div>
  );
};

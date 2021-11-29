import React from 'react';
import { MdImageNotSupported, MdPauseCircle, MdPlayCircle, MdSkipNext, MdSkipPrevious, MdStop } from 'react-icons/md';
import { environment } from '../env';
import { useAudio, useDuration, useOnEnded, usePercentage, usePlayState, usePosition } from '../Hooks/Playback';
import { usePlaybackState } from '../State/Playback';
import { ALink } from './Common/ActiveLink';
import { ProgressBar } from './Common/ProgressBar';
import { ResponsiveImage } from './Common/ResponsiveImage';
import { toReadableTime } from './Track/helpers';

export const Playback: React.VFC = () => {
  const playback = usePlaybackState();
  const track = playback.current;

  const [audio] = useAudio(track?.id ? `${environment.apiURL}/audio/${track!.id}` : undefined);
  const [position] = usePosition(audio);
  const duration = useDuration(audio);
  const [percentage, setPercentage] = usePercentage(audio);
  const [playing, setPlaying] = usePlayState(audio);
  useOnEnded(audio, playback.next);

  if (!track) return <></>;


  return (
    <div className="p-3 flex bg-elevate justify-between relative">

      <ProgressBar className="absolute top-0 left-0 right-0 w-full transform -translate-y-1/2"
                   percentage={percentage} onChange={setPercentage}/>

      <div className="flex items-center">
        <ALink href={`/books/${track.book.id}`} className="mr-3">
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
      </div>

      <div className="items-center hidden md:flex">
        <span className="pr-2">{toReadableTime(position)}</span>:
        <span className="pl-2">{toReadableTime(duration)}</span>
      </div>

      <audio/>
      <div className="flex items-center">
        <MdSkipPrevious className={`w-8 h-8 m-2 cursor-pointer ${playback.history.length === 0 ? 'text-elevate' : ''}`}
                        onClick={playback.previous}/>
        <span onClick={() => setPlaying(!playing)}>
         {playing ?
           <MdPauseCircle className="w-8 h-8 m-2 cursor-pointer"/>
           :
           <MdPlayCircle className="w-8 h-8 m-2 cursor-pointer"/>}
        </span>
        <MdSkipNext className={`w-8 h-8 m-2 cursor-pointer ${playback.queue.length === 0 ? 'text-elevate' : ''}`}
                    onClick={playback.next}/>
        <MdStop className="w-8 h-8 m-2 cursor-pointer" onClick={playback.stop}/>
      </div>
    </div>
  );
};

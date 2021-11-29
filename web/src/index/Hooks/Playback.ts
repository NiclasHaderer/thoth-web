import { useEffect, useState } from 'react';

export const useAudio = (url: string | undefined | null, autoplay = true): [HTMLAudioElement | null, (url: string) => void] => {

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url) return;
    const audioElement = document.createElement('audio');
    audioElement.setAttribute('controls', 'true');
    audioElement.src = url;
    autoplay && audioElement.play();
    setAudio(audioElement);
    return () => {
      audioElement.remove();
      audioElement.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);


  return [audio, (url: string) => {
    if (!audio) return;

    audio.src = url;
  }];
};

export const usePosition = (audio: HTMLAudioElement | undefined | null): [number | undefined, (seconds: number) => void] => {
  const [position, setPosition] = useState<number>();

  useEffect(() => {
    if (!audio) return;

    const update = () => setPosition(audio.currentTime);
    setPosition(audio.currentTime);

    audio.addEventListener('timeupdate', update);
    return () => audio.removeEventListener('timeupdate', update);
  }, [audio]);

  return [position, (seconds: number) => {
    if (!audio) return;
    audio.currentTime = seconds;
  }];
};

export const useDuration = (audio: HTMLAudioElement | undefined | null) => {
  const [position, setPosition] = useState<number | undefined>();

  useEffect(() => {
    if (!audio) return;

    setPosition(audio.duration);
    const update = () => setPosition(audio.duration);

    audio.addEventListener('durationchange', update);
    return () => audio.removeEventListener('durationchange', update);
  }, [audio]);


  return position;
};

export const usePercentage = (audio: HTMLAudioElement | undefined | null): [number | undefined, (percentage: number) => void] => {
  const [percentage, setPercentage] = useState<number>();


  useEffect(() => {
    if (!audio) return;

    setPercentage(audio.currentTime / audio.duration);
    const update = () => setPercentage(audio.currentTime / audio.duration);

    audio.addEventListener('timeupdate', update);
    return () => audio.removeEventListener('timeupdate', update);
  }, [audio]);


  return [percentage, (percentage: number) => {
    if (!audio) return;
    audio.currentTime = Math.floor(audio.duration * percentage);
    audio.play();
  }];
};

export const usePlayState = (audio: HTMLAudioElement | undefined | null): [boolean, (shouldPlay: boolean) => void] => {
  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!audio) return;

    setPlaying(!audio.paused);
    const update = () => setPlaying(!audio.paused);

    audio.addEventListener('play', update);
    audio.addEventListener('pause', update);

    return () => {
      audio.removeEventListener('play', update);
      audio.removeEventListener('pause', update);
    };
  }, [audio]);

  return [playing, (shouldPlay: boolean) => {
    if (!audio) return;
    if (shouldPlay) {
      audio.play();
    } else {
      audio.pause();
    }
  }];
};

export const useOnEnded = (audio: HTMLAudioElement | undefined | null, callback: () => void) => {
  useEffect(() => {
    if (!audio) return;

    const ended = () => callback();

    audio.addEventListener('ended', ended);
  }, [audio, callback]);
};

import React from 'react';
import { MdImageNotSupported } from 'react-icons/all';

interface TrackProps {
  cover: string | null;
  title: string;
  duration: number;
}
// TODO light-fix light active
export const Track: React.VFC<TrackProps> = ({cover, title, duration}) => (
  <div className="odd:light-active">
    <MdImageNotSupported
      className="w-16 h-16 rounded-md"/>
    {title} - {duration}
  </div>
);

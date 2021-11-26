import React, { useRef } from 'react';

interface ResponsiveImageProps extends React.HTMLAttributes<HTMLDivElement> {
  callback?: Function;
  src: string;
}

export const ResponsiveImage: React.VFC<ResponsiveImageProps> = ({src, ...props}) => {
  const element = useRef<HTMLDivElement>(null);

  return (
    <div ref={element} {...props} style={{backgroundImage: `url(${src})`}}
         className={`bg-no-repeat bg-center overflow-hidden bg-contain ${props.className}`}/>
  );
};

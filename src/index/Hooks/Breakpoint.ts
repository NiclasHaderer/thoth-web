import { useEffect, useState } from 'react';

type Breakpoints = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Breakpoint {
  matchDown(size: Breakpoints): boolean;
}


const getDeviceConfig = (width: number): Breakpoint => {
  return {
    matchDown(size: Breakpoints) {
      switch (size) {
        case 'sm':
          return width < 640;
        case 'md':
          return width < 768;
        case 'lg':
          return width < 1024;
        case 'xl':
          return width < 1280;
        case '2xl':
          return true;
      }
    }
  };
};

export const useBreakpoint = () => {
  const [breakPoint, setBreakPoint] = useState(() => getDeviceConfig(window.innerWidth));

  useEffect(() => {
    const calcWidth = () => {
      setBreakPoint(getDeviceConfig(window.innerWidth));
    };

    window.addEventListener('resize', calcWidth);
    return () => window.removeEventListener('resize', calcWidth);
  });

  return breakPoint;
};

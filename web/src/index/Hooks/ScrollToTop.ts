import { useEffect } from 'react';

export const useScrollToTop = (selector: string) => {
  useEffect(() => {
    const element = document.querySelector(selector);
    element && element.scrollTo(0, 0);
  });
};

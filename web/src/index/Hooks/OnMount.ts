import { EffectCallback, useEffect } from 'react';

export const useOnMount = (effect: EffectCallback) => {
  // eslint-disable-next-line
  useEffect(effect, []);
};

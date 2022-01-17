import { EffectCallback, useEffect } from 'react';

export const useOnMount = (effect: EffectCallback) => {
  useEffect(effect, [effect]);
};

export const useOnUnMount = (effect: () => void) => {
  useEffect(() => effect, [effect]);
};

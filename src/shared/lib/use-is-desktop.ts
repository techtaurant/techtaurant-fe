'use client';

import { useSyncExternalStore } from 'react';

const DESKTOP_QUERY = '(min-width: 768px)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener('change', onChange);

  return () => {
    media.removeEventListener('change', onChange);
  };
};

const getSnapshot = () => {
  return window.matchMedia(DESKTOP_QUERY).matches;
};

const getServerSnapshot = () => {
  return false;
};

export const useIsDesktop = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

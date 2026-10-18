'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { useGetMe } from '@/entities/user';

const READ_TOGGLE_GUIDE_STORAGE_KEY = 'post-detail-read-toggle-guide-seen';

const readGuideListeners = new Set<() => void>();

const subscribeReadGuideStore = (onStoreChange: () => void) => {
  readGuideListeners.add(onStoreChange);

  return () => {
    readGuideListeners.delete(onStoreChange);
  };
};

const getReadGuideSnapshot = () => {
  try {
    return window.localStorage.getItem(READ_TOGGLE_GUIDE_STORAGE_KEY) === 'true';
  } catch {
    return true;
  }
};

const getReadGuideServerSnapshot = () => {
  return true;
};

export const usePostDetailReadGuide = () => {
  const { data: me } = useGetMe();
  const hasSeenReadGuide = useSyncExternalStore(
    subscribeReadGuideStore,
    getReadGuideSnapshot,
    getReadGuideServerSnapshot,
  );

  const isReadGuideVisible = !!me && !hasSeenReadGuide;

  const dismissReadGuide = useCallback(() => {
    try {
      window.localStorage.setItem(READ_TOGGLE_GUIDE_STORAGE_KEY, 'true');
    } catch {}

    readGuideListeners.forEach((listener) => listener());
  }, []);

  return {
    dismissReadGuide,
    isReadGuideVisible,
  };
};

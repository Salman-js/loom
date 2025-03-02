'use client';

import { readerLocationStore } from '@/store/store';
import { useStore } from 'zustand';

export const useReaderLocation = () => {
  const {
    location,
    resetLocation,
    setLocation,
    url,
    setUrl,
    activeChapter,
    setActiveChapter,
  } = useStore(readerLocationStore);

  return {
    location,
    setLocation,
    resetLocation,
    url,
    setUrl,
    activeChapter,
    setActiveChapter,
  };
};

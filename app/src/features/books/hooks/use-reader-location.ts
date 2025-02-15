'use client';

import { readerLocationStore } from '@/store/store';
import { useStore } from 'zustand';

export const useReaderLocation = () => {
  const { location, resetLocation, setLocation } =
    useStore(readerLocationStore);

  return {
    location,
    setLocation,
    resetLocation,
  };
};

'use client';

import { readerStyleStore } from '@/store/store';
import { useStore } from 'zustand';

export const useReaderStyle = () => {
  const {
    background,
    text,
    fontFamily,
    fontSize,
    setColorStyle,
    setFontFamily,
    setFontSize,
    resetStyle,
  } = useStore(readerStyleStore);

  return {
    background,
    text,
    fontFamily,
    fontSize,
    setColorStyle,
    setFontFamily,
    setFontSize,
    resetStyle,
  };
};

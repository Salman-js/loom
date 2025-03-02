'use client'

import ePub, { NavItem } from 'epubjs';
import { useEffect, useState } from 'react';
export const useChapters = (url: string | undefined) => {
  const [toc, setToc] = useState<NavItem[]>([]);
  useEffect(() => {
    if (url) {
      const book = ePub(url);
      book.loaded.navigation.then((navigation) => {
        const tocArray = navigation.toc;
        setToc(tocArray);
      });
    } else {
      setToc([]);
    }
  }, [url]);
  return toc;
};

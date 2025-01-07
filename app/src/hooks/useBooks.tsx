import { IBook } from '@/interface/book.interface';
import { useFetchQuery } from './query.hooks';
import { endpoints } from '@/lib/constants';
import { useMemo } from 'react';
import { QueryKey } from '@tanstack/react-query';

export const useFetchBooks = (
  page: number,
  size: number,
  filterOptions?: Record<string, any>
) => {
  const { search, ...filter } = filterOptions ?? { search: undefined };
  const queryParams = {
    path: '/apps/loooom',
  };
  return useFetchQuery<IBook[]>(
    endpoints.BOOK,
    ['accounts', queryParams],
    queryParams
  );
};

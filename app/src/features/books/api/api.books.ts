import { useFetchQuery, useMutate } from '@/hooks/query.hooks';
import { IBook } from '../interface/book.interface';
import { endpoints } from '@/lib/constants';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  onErrorNotification,
  onSuccessNotification,
} from '@/lib/notifications';

export const useFetchBooks = (
  page: number,
  size: number,
  filterOptions?: Record<string, any>
) => {
  const { search, ...filter } = filterOptions ?? { search: undefined };
  const queryParams = {
    page: page?.toString(),
    size: size?.toString(),
    ...(filter ? { ...filter } : {}),
    ...(search ? { search } : {}),
  };
  return useFetchQuery<IBook[]>(
    endpoints.BOOK,
    ['books', queryParams],
    queryParams
  );
};

export const useAddBook = () => {
  const queryClient = useQueryClient();
  const onError = (error: AxiosError | any) => {
    onErrorNotification(error);
  };
  const onSuccess = (data: any) => {
    // console.log(data);
    queryClient.invalidateQueries({
      queryKey: ['books'],
    });
    onSuccessNotification(data);
  };
  return useMutate<{ id: string; url: string }[], FormData>(
    endpoints.BOOK,
    'post',
    {
      onSuccess,
      onError,
    },
    'multipart/form-data'
  );
};

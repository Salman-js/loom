import { useFetchQuery, useMutate, usePagination } from '@/hooks/query.hooks';
import { IBook } from '../interface/book.interface';
import { endpoints } from '@/lib/constants';
import { useQueryClient, UseMutationOptions } from '@tanstack/react-query';
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

export const useAddBook = ({
  onSuccess: onCustomSuccess,
  onError: onCustomError,
}: {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: AxiosError | any) => void;
}) => {
  const queryClient = useQueryClient();
  const onError = (error: AxiosError | any) => {
    onErrorNotification(error);
    onCustomError?.(error);
  };
  const onSuccess = (data: { message: string }) => {
    queryClient.invalidateQueries({
      queryKey: ['books'],
    });
    onSuccessNotification({
      message: {
        title: 'Book Added',
        description: data.message,
      },
    });
    onCustomSuccess?.(data);
  };
  return useMutate<{ message: string }>(endpoints.BOOK, 'post', {
    onSuccess,
    onError,
  });
};

export const useBookPagination = (queryParams?: Record<string, any>) => {
  return usePagination(
    endpoints.BOOK,
    ['books', 'total', queryParams],
    queryParams
  );
};

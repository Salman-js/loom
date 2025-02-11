import { useFetchQuery, useMutate, usePagination } from '@/hooks/query.hooks';
import { endpoints } from '@/lib/constants';
import { useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  onErrorNotification,
  onSuccessNotification,
} from '@/lib/notifications';
import { IShelf } from '../interface/shelf.interface';

export const useFetchShelves = (
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
  return useFetchQuery<IShelf[]>(
    endpoints.SHELF,
    ['shelves', queryParams],
    queryParams
  );
};
export const useFetchShelvesLight = () => {
  return useFetchQuery<IShelf[]>(endpoints.SHELF + `/light`, [
    'shelves',
    'light',
  ]);
};
export const useFetchShelfById = (id?: string) => {
  return useFetchQuery<IShelf>(
    endpoints.SHELF + `/${id}`,
    ['shelves', id],
    {},
    {
      enabled: !!id,
      queryKey: ['shelves', id],
    }
  );
};
export const useAddShelf = ({
  onSuccess: onCustomSuccess,
  onError: onCustomError,
}: {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: AxiosError | any) => void;
}) => {
  const queryClient = useQueryClient();
  const onError = (error: AxiosError | any) => {
    const errorMessageObject = (): {
      title: string;
      description: string;
    } | null => {
      let errorMessage;
      switch (error.status) {
        case 409:
          errorMessage = {
            title: '🗄️Shelf already exists',
            description: error.response.data.message,
          };
          break;
        default:
          errorMessage = null;
          break;
      }
      return errorMessage;
    };
    onErrorNotification(errorMessageObject() || error);
    onCustomError?.(error);
  };
  const onSuccess = (data: { message: string }) => {
    queryClient.invalidateQueries({
      queryKey: ['shelves'],
    });
    onSuccessNotification({
      message: {
        title: '🗄️Shelf Added',
        description: data.message,
      },
    });
    onCustomSuccess?.(data);
  };
  return useMutate<{ message: string }>(endpoints.SHELF, 'post', {
    onSuccess,
    onError,
  });
};

export const useAddBookToShelf = (
  bookId: string,
  mutationOptions?: UseMutationOptions<{ title: string; message: string }>
) => {
  const queryClient = useQueryClient();
  const onError = (error: AxiosError | any) => {
    const errorMessageObject = (): {
      title: string;
      description: string;
    } | null => {
      let errorMessage;
      switch (error.status) {
        default:
          errorMessage = null;
          break;
      }
      return errorMessage;
    };
    onErrorNotification(errorMessageObject() || error);
  };
  const onSuccess = (data: { title: string; message: string }) => {
    queryClient.invalidateQueries({
      queryKey: ['shelves'],
    });
    queryClient.invalidateQueries({
      queryKey: ['books', bookId],
    });
    onSuccessNotification({
      message: {
        title: `📖${data.title}`,
        description: data.message,
      },
    });
  };
  return useMutate<{ title: string; message: string }>(
    endpoints.SHELF + `/add-book/${bookId}`,
    'patch',
    {
      onSuccess,
      onError,
      ...mutationOptions,
    }
  );
};
export const useShelfPagination = (queryParams?: Record<string, any>) => {
  return usePagination(
    endpoints.SHELF,
    ['shelves', 'total', queryParams],
    queryParams
  );
};

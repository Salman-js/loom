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

export const useFetchBooksLight = () => {
  return useFetchQuery<IBook[]>(endpoints.BOOK + `/light`, ['books', 'light']);
};
export const useFetchBookById = (id?: string) => {
  return useFetchQuery<IBook>(
    endpoints.BOOK + `/${id}`,
    ['books', id],
    {},
    {
      enabled: !!id,
      queryKey: ['books', id],
    }
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
    const errorMessageObject = (): {
      title: string;
      description: string;
    } | null => {
      let errorMessage;
      switch (error.status) {
        case 409:
          errorMessage = {
            title: '📖Book already exists',
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
      queryKey: ['books'],
    });
    onSuccessNotification({
      message: {
        title: '📖Book Added',
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

export const useAddHighlight = (
  id: string,
  {
    onSuccess: onCustomSuccess,
    onError: onCustomError,
  }: {
    onSuccess?: (data: { message: string }) => void;
    onError?: (error: AxiosError | any) => void;
  }
) => {
  const queryClient = useQueryClient();
  const onError = (error: AxiosError | any) => {
    onErrorNotification(error);
    onCustomError?.(error);
  };
  const onSuccess = (data: { message: string }) => {
    queryClient.invalidateQueries({
      queryKey: ['books', id],
    });
    onSuccessNotification({
      message: {
        title: '📖Highlight Added',
        description: data.message,
      },
    });
    onCustomSuccess?.(data);
  };
  return useMutate<{ message: string }>(
    endpoints.BOOK + `/${id}/highlight`,
    'patch',
    {
      onSuccess,
      onError,
    }
  );
};

export const useAddNote = (
  id: string,
  {
    onSuccess: onCustomSuccess,
    onError: onCustomError,
  }: {
    onSuccess?: (data: { message: string }) => void;
    onError?: (error: AxiosError | any) => void;
  }
) => {
  const queryClient = useQueryClient();
  const onError = (error: AxiosError | any) => {
    onErrorNotification(error);
    onCustomError?.(error);
  };
  const onSuccess = (data: { message: string }) => {
    queryClient.invalidateQueries({
      queryKey: ['books', id],
    });
    onSuccessNotification({
      message: {
        title: 'Note Added',
        description: data.message,
      },
    });
    onCustomSuccess?.(data);
  };
  return useMutate<{ message: string }>(
    endpoints.BOOK + `/${id}/note`,
    'patch',
    {
      onSuccess,
      onError,
    }
  );
};

export const useDeleteHighlight = (
  id: string,
  {
    onSuccess: onCustomSuccess,
    onError: onCustomError,
  }: {
    onSuccess?: (data: { message: string }) => void;
    onError?: (error: AxiosError | any) => void;
  }
) => {
  const queryClient = useQueryClient();
  const onError = (error: AxiosError | any) => {
    onErrorNotification(error);
    onCustomError?.(error);
  };
  const onSuccess = (data: { message: string }) => {
    queryClient.invalidateQueries({
      queryKey: ['books', id],
    });
    onSuccessNotification({
      message: {
        title: '📖Highlight Removed',
        description: data.message,
      },
    });
    onCustomSuccess?.(data);
  };
  return useMutate<{ message: string }>(
    endpoints.BOOK + `/${id}/highlight`,
    'delete',
    {
      onSuccess,
      onError,
    }
  );
};
export const useDeleteNote = (
  id: string,
  {
    onSuccess: onCustomSuccess,
    onError: onCustomError,
  }: {
    onSuccess?: (data: { message: string }) => void;
    onError?: (error: AxiosError | any) => void;
  }
) => {
  const queryClient = useQueryClient();
  const onError = (error: AxiosError | any) => {
    onErrorNotification(error);
    onCustomError?.(error);
  };
  const onSuccess = (data: { message: string }) => {
    queryClient.invalidateQueries({
      queryKey: ['books', id],
    });
    onSuccessNotification({
      message: {
        title: 'Note Removed',
        description: data.message,
      },
    });
    onCustomSuccess?.(data);
  };
  return useMutate<{ message: string }>(
    endpoints.BOOK + `/${id}/note`,
    'delete',
    {
      onSuccess,
      onError,
    }
  );
};
export const useUpdateBookmark = (
  id: string,
  {
    onSuccess: onCustomSuccess,
    onError: onCustomError,
  }: {
    onSuccess?: (data: { message: string }) => void;
    onError?: (error: AxiosError | any) => void;
  }
) => {
  const queryClient = useQueryClient();
  const onError = (error: AxiosError | any) => {
    onErrorNotification(error);
    onCustomError?.(error);
  };
  const onSuccess = (data: { message: string }) => {
    queryClient.invalidateQueries({
      queryKey: ['books', id],
    });
    onCustomSuccess?.(data);
  };
  return useMutate<{ message: string }>(
    endpoints.BOOK + `/${id}/bookmark`,
    'patch',
    {
      onSuccess,
      onError,
    }
  );
};
export const useBookPagination = (queryParams?: Record<string, any>) => {
  return usePagination(
    endpoints.BOOK,
    ['books', 'total', queryParams],
    queryParams
  );
};

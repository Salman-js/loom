import { useAuth } from '@/features/auth/hooks/auth.hooks';
import { BASE_URI } from '@/lib/constants';
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URI,
  });
  return instance;
};
export const useMutate = <TData = any, TVariables = any>(
  url: string,
  method: Method = 'post',
  mutationOptions?: UseMutationOptions<TData, any, TVariables, unknown>,
  contentTypes?: string | string[]
) => {
  const { user } = useAuth();
  const axiosInstance = createAxiosInstance();
  const mutationFn = async (variables: TVariables) => {
    const isFormData = variables instanceof FormData;
    const config: AxiosRequestConfig = {
      method,
      url,
      data: variables,
      headers: {
        ...(isFormData
          ? {}
          : { 'Content-Type': contentTypes ?? 'application/json' }),
        // Authorization: 'Bearer ' + window.localStorage.getItem('bearer_token'),
        'user-id': user?.id,
      },
    };
    const response = await axiosInstance(config);
    return response.data as TData;
  };

  return useMutation<TData, any, TVariables, unknown>({
    mutationFn,
    ...mutationOptions,
  });
};

export function useFetchQuery<TData = any>(
  url: string,
  queryKey: QueryKey,
  queryParams?: Record<string, any>,
  queryOptions?: UseQueryOptions<TData>
) {
  const axiosInstance = createAxiosInstance();
  const { user } = useAuth();
  const queryFn = async (): Promise<TData> => {
    return await axiosInstance
      .get(url, {
        params: queryParams,
        headers: {
          // Authorization:
          //   'Bearer ' + window.localStorage.getItem('bearer_token'),
          'user-id': user?.id,
        },
      })
      .then((res: AxiosResponse<TData>) => res.data);
  };

  return useQuery<TData>({ ...queryOptions, queryKey, queryFn });
}

export const usePagination = (
  url: string,
  queryKey: QueryKey,
  queryParams?: Record<string, any>,
  initSize?: number
) => {
  const [size, setSize] = useState(initSize ?? 100);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const totalSize = useTotalSize(url + '/total_count', queryKey, queryParams);
  useEffect(() => {
    if (totalSize) {
      setPages(Math.ceil(totalSize / size));
    }
  }, [totalSize, size]);
  return {
    size,
    setSize,
    pages,
    setPages,
    page,
    setPage,
  };
};

export const useTotalSize = (
  url: string,
  queryKey: QueryKey,
  queryParams?: Record<string, any>
): number => {
  const [totalSize, setTotalSize] = useState(0);
  const { data, refetch } = useFetchQuery<number>(url, queryKey, queryParams);
  useEffect(() => {
    if (data) {
      setTotalSize(typeof data === 'number' ? data : 0);
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, [queryParams]);
  return totalSize;
};

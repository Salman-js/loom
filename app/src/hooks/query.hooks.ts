import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: 'https://api.dropboxapi.com/2',
  });
  return instance;
};
export const useMutate = <TData = any, TVariables = any>(
  url: string,
  method: Method = 'post',
  mutationOptions?: UseMutationOptions<TData, any, TVariables, unknown>,
  contentTypes?: string | string[]
) => {
  const axiosInstance = createAxiosInstance();
  const mutationFn = async (variables: TVariables) => {
    const config: AxiosRequestConfig = {
      method,
      url,
      data: variables,
      headers: {
        'Content-Type': contentTypes ?? 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
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
  const queryFn = async (): Promise<TData> => {
    return await axiosInstance
      .get(url, {
        params: queryParams,
      })
      .then((res: AxiosResponse<TData>) => res.data);
  };

  return useQuery<TData>({ ...queryOptions, queryKey, queryFn });
}

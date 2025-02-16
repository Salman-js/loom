import { toast } from 'sonner';

import { AxiosError } from 'axios';

export const onErrorNotification = (error: AxiosError | any) => {
  return toast(error?.title ?? 'Error', {
    description: error?.description || error?.response?.data?.message,
    closeButton: true,
  });
};

export const onSuccessNotification = <T>(data: {
  data?: T | any;
  message?: {
    title: string;
    description: string;
  };
}) => {
  return toast(data?.message?.title ?? 'Success', {
    description: data?.message?.description,
    closeButton: true,
  });
};

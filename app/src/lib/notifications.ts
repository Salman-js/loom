import { toast } from 'sonner';

import { AxiosError } from 'axios';

export const onErrorNotification = (error: AxiosError | any) => {
  return toast('Error', {
    description: error?.response?.data.message || 'An error occurred',
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
    description: data?.message?.description ?? 'action was successful',
  });
};

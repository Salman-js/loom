import { toast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

export const onErrorNotification = (error: AxiosError | any) => {
  console.log(error);
  toast({
    title: 'Error',
    content: error?.response?.data.message || 'An error occurred',
  });
};

export const onSuccessNotification = <T>(data: T | any, message?: string) => {
  toast({
    title: 'Success',
    content: message
      ? message
      : data?.message
      ? data?.message
      : 'action was successful',
    color: 'green',
  });
};

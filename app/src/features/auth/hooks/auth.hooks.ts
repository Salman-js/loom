import { signIn, signOut, signUp, useSession } from '@/lib/auth-client';
import { store } from '@/store/store';
import { useMutation } from '@tanstack/react-query';
import {
  ErrorContext,
  RequestContext,
  SuccessContext,
} from 'better-auth/react';
import { useRouter } from 'next/navigation';
import { useStore } from 'zustand';

export const useSignOut = <TData = any, TVariables = any>(requestOptions?: {
  onRequest?: (context: RequestContext) => void;
  onSuccess?: (context: SuccessContext) => void;
  onError?: (context: ErrorContext) => void;
}) => {
  const router = useRouter();
  const { signOut: storeSignOut } = useAuth();
  const mutationFn = async () => {
    const res = await signOut({
      fetchOptions: {
        onError: (ctx) => {
          requestOptions?.onError?.(ctx);
        },
        onSuccess: (ctx) => {
          storeSignOut();
          router.push('/sign-in');
          requestOptions?.onSuccess?.(ctx);
        },
        onRequest: (ctx) => {
          requestOptions?.onRequest?.(ctx);
        },
      },
    });
    return res as TData;
  };

  return useMutation({
    mutationFn,
  });
};

export const useSignIn = <TData = any, TVariables = any>(
  provider: 'google' | 'github' | 'facebook' | 'email',
  requestOptions?: {
    onRequest?: (context: RequestContext) => void;
    onSuccess?: (context: SuccessContext) => void;
    onError?: (context: ErrorContext) => void;
  }
) => {
  const { setUser } = useAuth();
  const mutationFn = async (values?: { email?: string; password?: string }) => {
    const res =
      provider === 'email' && values
        ? await signIn.email(
            {
              email: values.email ?? '',
              password: values.password ?? '',
              callbackURL: '/',
            },
            {
              onError: (ctx) => {
                console.log('Error: ', ctx.error);
                requestOptions?.onError?.(ctx);
              },
              onSuccess: (ctx) => {
                setUser(ctx.data?.user ?? null);
                // router.push('/');
                requestOptions?.onSuccess?.(ctx);
              },
              onRequest: (ctx) => {
                requestOptions?.onRequest?.(ctx);
              },
            }
          )
        : provider !== 'email' &&
          (await signIn.social({
            provider,
            callbackURL: '/',
            fetchOptions: {
              onError: (ctx) => {
                console.log('Error: ', ctx.error);
                requestOptions?.onError?.(ctx);
              },
              onSuccess: (ctx) => {
                // router.push('/');
                requestOptions?.onSuccess?.(ctx);
              },
              onRequest: (ctx) => {
                requestOptions?.onRequest?.(ctx);
              },
            },
          }));
    return res as TData;
  };
  return useMutation({
    mutationFn,
  });
};

export const useSignUp = <TData = any, TVariables = any>(requestOptions?: {
  onRequest?: (context: RequestContext) => void;
  onSuccess?: (context: SuccessContext) => void;
  onError?: (context: ErrorContext) => void;
}) => {
  const router = useRouter();
  const { setUser } = useAuth();
  const mutationFn = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    const res = await signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: '/',
      },
      {
        onError: (ctx) => {
          console.log('Error: ', ctx.error);
          requestOptions?.onError?.(ctx);
        },
        onSuccess: (ctx) => {
          setUser(ctx.data?.user ?? null);
          // router.push('/');
          requestOptions?.onSuccess?.(ctx);
        },
        onRequest: (ctx) => {
          requestOptions?.onRequest?.(ctx);
        },
      }
    );
    return res as TData;
  };
  return useMutation({
    mutationFn,
  });
};
export const useAuth = () => {
  const { user, setUser, signOut } = useStore(store);
  return {
    user,
    setUser,
    signOut,
  };
};

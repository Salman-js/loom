import { store } from '@/store/store';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useStore } from 'zustand';

export const useSignOut = <TData = any, TVariables = any>() => {
  const mutationFn = async () => {
    const res = await signOut();
    return res as TData;
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      store.getState().signOut();
    },
  });
};

export const useSignIn = <TData = any, TVariables = any>(
  provider: 'google' | 'github' | 'facebook'
) => {
  const { data: session } = useSession();
  const mutationFn = async () => {
    const res = await signIn(provider, { callbackUrl: '/' });
    return res as TData;
  };
  useEffect(() => {
    if (session?.user) {
      store.getState().setUser(session.user);
    }
  }, [session]);
  return useMutation({
    mutationFn,
    onSuccess: () => {
      if (session?.user) {
        store.getState().setUser(session?.user);
      }
    },
  });
};

export const useAuth = () => {
  const { user, setUser } = useStore(store);
  return {
    user,
    setUser,
  };
};

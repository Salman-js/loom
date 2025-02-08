import { store, tokenStore } from '@/store/store';
import { useMutation } from '@tanstack/react-query';
import { signIn, signOut } from 'next-auth/react';
import { useStore } from 'zustand';

export const useSignOutV2 = <TData = any, TVariables = any>() => {
  const { signOut: storeSignOut } = useAuth();
  const mutationFn = async () => {
    const res = await signOut({
      callbackUrl: '/sign-in',
    });
    return res as TData;
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      storeSignOut();
    },
  });
};
export const useSignInV2 = <TData = any, TVariables = any>(
  provider: 'google' | 'github' | 'facebook'
) => {
  const mutationFn = async () => {
    await signIn(provider, { callbackUrl: '/' });
  };
  return useMutation({
    mutationFn,
  });
};

export const useAuth = () => {
  const { user, setUser, signOut } = useStore(store);
  const { token, setToken } = useStore(tokenStore);
  return {
    user,
    setUser,
    signOut,
    token,
    setToken,
  };
};

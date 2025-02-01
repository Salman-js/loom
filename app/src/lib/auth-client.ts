import { createAuthClient } from 'better-auth/react';
export const {
  signIn,
  signOut,
  signUp,
  getSession,
  useSession,
  ...authClient
} = createAuthClient({
  baseURL: 'http://localhost:3000',
});

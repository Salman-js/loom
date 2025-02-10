'use client';
import { Toaster } from '@/components/ui/toaster';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import SidebarContainer from '../app/ui/sidebar.container';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NextTopLoader from 'nextjs-toploader';
import { useTheme } from 'next-themes';
import { useAuth } from '@/features/auth/hooks/auth.hooks';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import UnAuthorized from './ui/unauthorized';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000 * 5,
    },
  },
});
export default function Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useTheme();
  const { user, setUser, setToken } = useAuth();
  const { data: session, status } = useSession();
  const sessionUser = useMemo(() => session?.user, [session]);
  useEffect(() => {
    if (sessionUser) {
      setUser(sessionUser);
    }
  }, [sessionUser]);
  useEffect(() => {
    if (
      !session &&
      status === 'unauthenticated' &&
      window?.location?.pathname !== '/sign-in'
    ) {
      window.location.href = '/sign-in';
    }
  }, [status, session]);

  if (status === 'loading') {
    return (
      <div className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
        <Loader2 className='h-32 w-32 animate-spin' />
      </div>
    );
  }

  if (
    !session &&
    status === 'unauthenticated' &&
    window?.location?.pathname !== '/sign-in'
  ) {
    return <UnAuthorized />;
  }
  return (
    <SidebarProvider>
      <NextTopLoader color={theme === 'light' ? '#18181b' : '#fafafa'} />
      <QueryClientProvider client={queryClient}>
        <SidebarContainer />
        <SidebarInset>{children}</SidebarInset>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster />
    </SidebarProvider>
  );
}

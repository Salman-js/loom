'use client';
import { Toaster } from '@/components/ui/toaster';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import SidebarContainer from '../app/ui/sidebar.container';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NextTopLoader from 'nextjs-toploader';
import { useTheme } from 'next-themes';

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
  return (
    <SidebarProvider>
      <NextTopLoader color={theme === 'light' ? '#18181b' : '#fafafa'} />
      <QueryClientProvider client={queryClient}>
        <SidebarContainer />
        <SidebarInset>{children}</SidebarInset>
      </QueryClientProvider>
      <Toaster />
    </SidebarProvider>
  );
}

'use client';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import SidebarContainer from '../app/ui/sidebar.container';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
export default function Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SidebarContainer />
      <QueryClientProvider client={queryClient}>
        <SidebarInset>{children}</SidebarInset>
      </QueryClientProvider>
      <Toaster />
    </SidebarProvider>
  );
}

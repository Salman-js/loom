'use client';
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
      <QueryClientProvider client={queryClient}>
        <SidebarContainer />
        <SidebarInset>{children}</SidebarInset>
      </QueryClientProvider>
      <Toaster />
    </SidebarProvider>
  );
}

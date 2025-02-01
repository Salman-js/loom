'use client';
import { AppSidebar } from '@/components/ui/sidebar/main';
import { useAuth } from '@/features/auth/hooks/auth.hooks';
import { BookSidebar } from '@/features/books/components/Sidebar';
import { useSession } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

type sidebarContainerProps = {};

const SidebarContainer: React.FC<sidebarContainerProps> = () => {
  const { data: session } = useSession();
  const user = useMemo(() => session?.user, [session]);
  const pathname = usePathname();
  return user ? (
    pathname.includes('read') ? (
      <BookSidebar />
    ) : (
      <AppSidebar />
    )
  ) : null;
};
export default SidebarContainer;

'use client';
import { AppSidebar } from '@/components/ui/sidebar/main';
import { BookSidebar } from '@/features/books/components/Sidebar';
import { usePathname } from 'next/navigation';
import path from 'path';
import React from 'react';

type sidebarContainerProps = {};

const SidebarContainer: React.FC<sidebarContainerProps> = () => {
  const pathname = usePathname();
  return pathname.includes('read') ? <BookSidebar /> : <AppSidebar />;
};
export default SidebarContainer;

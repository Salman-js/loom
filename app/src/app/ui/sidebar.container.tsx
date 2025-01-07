'use client';
import { BookSidebar } from '@/components/book/Sidebar';
import { AppSidebar } from '@/components/home/Sidebar';
import { usePathname } from 'next/navigation';
import React from 'react';

type sidebarContainerProps = {};

const SidebarContainer: React.FC<sidebarContainerProps> = () => {
  const pathname = usePathname();
  return pathname.includes('book') ? <BookSidebar /> : <AppSidebar />;
};
export default SidebarContainer;

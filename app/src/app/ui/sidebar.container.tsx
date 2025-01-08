'use client';
import { BookSidebar } from '@/components/book/Sidebar';
import { AppSidebar } from '@/components/home/Sidebar';
import { usePathname } from 'next/navigation';
import path from 'path';
import React from 'react';

type sidebarContainerProps = {};

const SidebarContainer: React.FC<sidebarContainerProps> = () => {
  const pathname = usePathname();
  return pathname.includes('sign') ? null : pathname.includes('book') ? <BookSidebar /> : <AppSidebar />;
};
export default SidebarContainer;

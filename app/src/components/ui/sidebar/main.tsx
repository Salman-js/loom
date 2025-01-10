'use client';

import * as React from 'react';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { Library } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { AddBookDialog } from '@/features/books/components/add-book';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useSession();
  const user = React.useMemo(() => data?.user, [data]);
  return (
    <Sidebar collapsible='icon' {...props}>
      <div className='flex flex-row justify-end items-center p-3'>
        <SidebarTrigger />
      </div>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href='/'>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Image src='/logo-light.png' alt='L' width={20} height={20} />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Loom</span>
                  <span className='truncate text-xs'>bookshelf</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <AddBookDialog />
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <Link href='/shelves'>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                  tooltip='Shelves'
                >
                  <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent'>
                    <Library />
                  </div>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>Shelves</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

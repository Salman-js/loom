'use client';

import * as React from 'react';
import {
  AudioWaveform,
  CaseSensitive,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  Palette,
  PieChart,
  Settings2,
  SunMoon,
} from 'lucide-react';

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
  useSidebar,
} from '@/components/ui/sidebar';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import ThemeSelector from '../home/ui/ThemeSelector';
import FontSelector from '../home/ui/FontSelector';
import { NavUser } from '../home/nav-user';
import { NavMain } from '../home/nav-main';
import { NavChapters } from '../home/nav.chapters';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function BookSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const user = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  };
  const data = {
    chapters: Array.from({ length: 6 }, (_, i) => ({
      name: `Chapter extra text ${i + 1}`,
    })),
  };
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
      <SidebarContent>
        <NavMain />
        <NavChapters chapters={data.chapters} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

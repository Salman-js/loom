'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function NavChapters({
  chapters,
}: {
  chapters: {
    name: string;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Chapters</SidebarGroupLabel>
      <SidebarMenu>
        {chapters.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild className='py-2 cursor-pointer'>
              <span className='w-full truncate'>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from '@/components/ui/sidebar';
import { useChapters } from '@/features/books/hooks/use-chapters';
import { useReaderLocation } from '@/features/books/hooks/use-reader-location';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../collapsible';
import { ChevronRight } from 'lucide-react';

export function NavChapters() {
  const { open, state, toggleSidebar, isMobile } = useSidebar();
  const { url, setActiveChapter } = useReaderLocation();
  const toc = useChapters(url);
  const handleChapterClick = (href: string) => {
    setActiveChapter(href);
  };
  return (
    <SidebarGroup>
      <Collapsible asChild className='group/collapsible'>
        <SidebarMenu>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              onClick={() => {
                if (state === 'collapsed' && !isMobile) toggleSidebar();
              }}
            >
              <SidebarGroupLabel>Chapters</SidebarGroupLabel>
              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className='max-h-[30em] overflow-y-auto'>
            <SidebarMenuSub>
              {toc.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className='py-2 cursor-pointer'
                    onClick={() => handleChapterClick(item.href)}
                  >
                    <span className='w-full truncate'>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenu>
      </Collapsible>
    </SidebarGroup>
  );
}

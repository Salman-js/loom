'use client';

import {
  CaseSensitive,
  Check,
  ChevronRight,
  Palette,
  SunMoon,
  type LucideIcon,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import ThemeSelector from './ui/ThemeSelector';
import FontSelector from './ui/FontSelector';
import ColorSelector from './ui/ColorSelector';

export function NavMain() {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const options = [
    {
      title: 'Theme',
      icon: SunMoon,
      child: <ThemeSelector />,
    },
    {
      title: 'Font',
      icon: CaseSensitive,
      child: <FontSelector />,
    },
    {
      title: 'Color',
      icon: Palette,
      child: <ColorSelector />,
    },
  ];
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu>
        {options.map((item) => (
          <Collapsible key={item.title} asChild className='group/collapsible'>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => {
                    if (state === 'collapsed' && !isMobile) toggleSidebar();
                  }}
                >
                  {item.icon && <item.icon size={30} />}
                  <span>{item.title}</span>
                  <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>{item.child}</CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

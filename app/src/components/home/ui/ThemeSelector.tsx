import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import { Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

type ThemeSelectorProps = {};

const ThemeSelector: React.FC<ThemeSelectorProps> = () => {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenuSub>
      <SidebarMenuItem onClick={() => setTheme('dark')}>
        <SidebarMenuButton>
          <div className='mr-2 w-4'>
            {theme === 'dark' && <Check size={18} />}
          </div>
          Dark
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem onClick={() => setTheme('light')}>
        <SidebarMenuButton>
          <div className='mr-2 w-4'>
            {theme === 'light' && <Check size={18} />}
          </div>
          Light
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenuSub>
  );
};
export default ThemeSelector;

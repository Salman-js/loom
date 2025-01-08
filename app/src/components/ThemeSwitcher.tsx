import React from 'react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

type ThemeSwitcherProps = {};

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size='icon'
      variant='secondary'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  );
};
export default ThemeSwitcher;

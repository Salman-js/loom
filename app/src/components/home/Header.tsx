import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type HeaderProps = {
  searchText?: string;
  onSearchTextChange?: (searchText: string) => void;
};

const Header: React.FC<HeaderProps> = ({ searchText, onSearchTextChange }) => {
  return (
    <div className='main-header justify-end'>
      <div className='lg:hidden block'>
        <SidebarTrigger />
      </div>
      <div className='header-controls-container w-full justify-end'>
        <Input
          placeholder='Search...'
          className='w-80'
          value={searchText ?? undefined}
          onChange={(e) => onSearchTextChange?.(e.target.value)}
        />
      </div>
    </div>
  );
};
export default Header;

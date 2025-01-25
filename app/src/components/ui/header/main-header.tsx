import React from 'react';
import { SidebarTrigger } from '../sidebar';
import { Input } from '../input';
import SortingDropdown from './sorter';

type HeaderProps = {
  searchText?: string;
  onSearchTextChange?: (searchText: string) => void;
};

const Header: React.FC<HeaderProps> = ({ searchText, onSearchTextChange }) => {
  return (
    <div className='main-header justify-end'>
      <div className='flex flex-row space-x-3'>
        <div className='lg:hidden block'>
          <SidebarTrigger />
        </div>
        <Input
          placeholder='Search...'
          className='w-80'
          value={searchText ?? undefined}
          onChange={(e) => onSearchTextChange?.(e.target.value)}
        />
      </div>
      <div className='header-controls-container w-full justify-end'>
        <SortingDropdown />
      </div>
    </div>
  );
};
export default Header;

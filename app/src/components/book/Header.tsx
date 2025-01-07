import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  return (
    <div className='main-header'>
      <Link href='/'>
        <Button variant='secondary'>
          <ArrowLeft /> Back to books
        </Button>
      </Link>
    </div>
  );
};
export default Header;

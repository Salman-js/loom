import React from 'react';
import { Button } from '../button';
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

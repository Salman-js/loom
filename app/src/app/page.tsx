'use client';
import Header from '@/components/ui/header/main-header';
import Books from '@/features/books/components/books';
import { store } from '@/store/store';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
export default function Home() {
  const [searchText, setSearchText] = useState('');
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      store.getState().setUser(session.user);
    }
  }, [session]);
  return (
    <div className='w-full'>
      <Header
        searchText={searchText}
        onSearchTextChange={(value) => setSearchText(value)}
      />
      <div className='page-container bg-white'>
        <Books searchText={searchText} />
      </div>
    </div>
  );
}

'use client';
import Header from '@/components/ui/header/main-header';
import Books from '@/features/books/components/books';
import { store } from '@/store/store';
import { useSession } from 'next-auth/react';
import { useDeferredValue, useEffect, useState } from 'react';
export default function Home() {
  const [searchText, setSearchText] = useState('');
  const query = useDeferredValue(searchText);
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
      <div className='page-container'>
        <Books searchText={query} />
      </div>
    </div>
  );
}

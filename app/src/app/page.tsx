'use client';
import Header from '@/components/ui/header/main-header';
import { useAuth } from '@/features/auth/hooks/auth.hooks';
import Books from '@/features/books/components/books';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useDeferredValue, useEffect, useState } from 'react';
export default function Home() {
  const [searchText, setSearchText] = useState('');
  const query = useDeferredValue(searchText);
  const router = useRouter();
  const { user } = useAuth();
  const { data: session } = useSession();
  useEffect(() => {
    if (!user && !session?.user) {
      router.push('/sign-in');
    }
  }, [user, session]);
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

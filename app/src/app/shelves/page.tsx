'use client';
import Header from '@/components/home/Header';
import Shelves from '@/components/shelf/Shelves';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
export default function Home() {
  const [searchText, setSearchText] = useState('');
  const { data } = useSession();
  const user = useMemo(() => data?.user, [data]);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user]);
  return (
    <div className='w-full'>
      <Header
        searchText={searchText}
        onSearchTextChange={(value) => setSearchText(value)}
      />
      <div className='page-container bg-white'>
        <Shelves searchText={searchText} />
      </div>
    </div>
  );
}

'use client';
import Header from '@/components/ui/header/main-header';
import Books from '@/features/books/components/books';
import { useDeferredValue, useEffect, useState } from 'react';
export default function Home() {
  const [searchText, setSearchText] = useState('');
  const query = useDeferredValue(searchText);
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

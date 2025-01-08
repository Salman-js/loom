'use client';
import Header from '@/components/home/Header';
import Books from '@/components/home/ui/books';
import { useState } from 'react';
export default function Home() {
  const [searchText, setSearchText] = useState('');
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

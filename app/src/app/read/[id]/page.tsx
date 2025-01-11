import Header from '@/components/ui/header/book-header';
import Reader from '@/features/books/components/reader/reader';
import React from 'react';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className='w-full'>
      <Header />
      <div className='page-container'>
        <Reader />
      </div>
    </div>
  );
}

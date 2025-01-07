import Header from '@/components/book/Header';
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
    </div>
  );
}

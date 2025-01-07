import Header from '@/components/book/Header';
import { books } from '@/lib/constants';
import { Bookmark, BookOpenText, Calendar1 } from 'lucide-react';
import React from 'react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import BookDescription from '@/components/book/BookDescription';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const book = books.find((book) => book.id === parseInt(id));

  return (
    <div className='w-full'>
      <Header />
      <div className='page-container'>
        <div className='w-full flex flex-row justify-start items-center p-10 px-20 gap-8'>
          <div className='w-2/5 p-14 bg-muted rounded-3xl'>
            <div className='w-full shadow-lg rounded-3xl overflow-hidden'>
              <img
                src={book?.image as string}
                alt={book?.title as string}
                className='w-full h-[50vh]'
              />
            </div>
          </div>
          <div className='w-full flex flex-col justify-start items-start pr-16'>
            <div>
              <span className='text-lg p-2 rounded-full text-muted-foreground px-4'>
                {book?.author}
              </span>
            </div>
            <div>
              <span className='text-8xl text-foreground font-semibold'>
                {book?.title}
              </span>
            </div>
            <div className='flex flex-row justify-start items-center gap-3'>
              <Button className='text-muted-foreground bg-muted rounded-full p-2 px-3'>
                <Calendar1 /> {dayjs().subtract(2, 'years').format('YYYY')}
              </Button>
              <Button className='text-muted-foreground bg-muted rounded-full p-2 px-3'>
                Thriller
              </Button>
              <Button className='text-muted-foreground bg-muted rounded-full p-2 px-3'>
                Drama
              </Button>
            </div>
            <div className='flex flex-row justify-start items-center gap-3 mt-4'>
              <Button>
                <BookOpenText /> Read
              </Button>
              <Button variant='outline'>
                <Bookmark /> Add to Favorites
              </Button>
            </div>
            <div className='mt-3'>
              {book && (
                <BookDescription description={book?.description || ''} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

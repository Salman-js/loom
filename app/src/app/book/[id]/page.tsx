import { Bookmark, BookOpenText, Calendar1 } from 'lucide-react';
import React from 'react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import BookDescription from '@/features/books/components/BookDescription';
import Header from '@/components/ui/header/book-header';
import AddToShelfButton from '@/features/shelves/components/add-to-shelf';
import { useFetchBookById } from '@/features/books/api/api.books';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const { data: book, isLoading, refetch, error } = useFetchBookById(id);

  return (
    <div className='w-full'>
      <Header />
      <div className='page-container'>
        <div className='w-full flex flex-col lg:flex-row justify-start items-center p-10 lg:px-20 px-3 gap-8'>
          <div className='w-full md:w-1/2 lg:w-[45%] lg:p-14 p-6 bg-muted'>
            <div className='w-full overflow-visible flex flex-row justify-center'>
              <img
                src={book?.cover as string}
                alt={book?.title as string}
                className='w-full lg:max-w-[20em] max-w-max h-[50vh] shadow-lg'
              />
            </div>
          </div>
          <div className='w-full flex flex-col justify-start items-start lg:pr-16 pr-0'>
            <div>
              <span className='text-lg p-2 rounded-full text-muted-foreground px-4'>
                {book?.author}
              </span>
            </div>
            <div>
              <span className='text-5xl text-foreground font-semibold'>
                {book?.title}
              </span>
            </div>
            <div className='flex flex-row justify-start items-center gap-3'>
              <Button className='text-muted-foreground bg-muted rounded-full p-2 px-3'>
                <Calendar1 /> {dayjs(book?.publishDate).format('YYYY')}
              </Button>
              <Button className='text-muted-foreground bg-muted rounded-full p-2 px-3'>
                {book?.genre}
              </Button>
            </div>
            <div className='flex flex-row justify-start items-center gap-3 mt-4'>
              <Button>
                <BookOpenText /> Read
              </Button>
              <AddToShelfButton id={id} />
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

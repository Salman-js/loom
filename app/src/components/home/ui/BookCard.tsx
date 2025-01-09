import { IBook } from '@/interface/book.interface';
import React from 'react';
import Link from 'next/link';
import AddToShelfButton from './add-to-shelf';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type BookCardProps = {
  book: IBook;
};

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { state } = useSidebar();
  return (
    <div
      className={cn(
        'book-card group',
        state === 'expanded' ? 'h-[33em]' : 'h-[30em]'
      )}
      style={{
        backgroundImage: `url(${book.image})`,
      }}
    >
      <div className='card-container'>
        <div className='card-detail-container'>
          <div className='text-container'>
            <Link href={`/book/${book.id}`}>
              <h2 className='text-3xl font-semibold text-gray-100'>
                {book.title}
              </h2>
            </Link>
            <p className='text-base text-gray-300 text-ellipsis line-clamp-6'>
              {book.description}
            </p>
          </div>
          <AddToShelfButton id={book.id.toString()} mini />
        </div>
      </div>
    </div>
  );
};
export default BookCard;

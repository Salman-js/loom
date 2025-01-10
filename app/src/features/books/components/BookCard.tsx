import { IBook } from '@/features/books/interface/book.interface';
import React from 'react';
import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import AddToShelfButton from '@/features/shelves/components/add-to-shelf';

type BookCardProps = {
  book: IBook;
};

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { state } = useSidebar();
  return (
    <div
      className='book-card group'
      style={{
        backgroundImage: `url(${book.image})`,
        height: state === 'expanded' ? '33em' : '30em',
      }}
    >
      <div className='card-container'>
        <div className='card-detail-container'>
          <div className='text-container'>
            <Link href={`/book/${book.id}`} className='text-3xl'>
              <p className='font-semibold text-gray-100 text-3xl'>
                {book.title}
              </p>
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

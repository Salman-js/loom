import { IBook } from '@/interface/book.interface';
import React from 'react';
import Link from 'next/link';
import AddToShelfButton from './add-to-shelf';

type BookCardProps = {
  book: IBook;
};

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div
      className='book-card group'
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

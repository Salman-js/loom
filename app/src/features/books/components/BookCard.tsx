import { IBook } from '@/features/books/interface/book.interface';
import React from 'react';
import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import AddToShelfButton from '@/features/shelves/components/add-to-shelf';

type BookCardProps = {
  book: IBook;
  onClick?: () => void;
};

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const { state } = useSidebar();
  return (
    <motion.div
      layoutId={`book-card-${book.id}`}
      className='book-card group'
      style={{
        backgroundImage: `url(${book.image})`,
        height: state === 'expanded' ? '33em' : '30em',
      }}
      onClick={onClick}
    >
      <motion.div layoutId={`card-${book.id}`} className='card-container'>
        <motion.div
          layoutId={`card-container-${book.id}`}
          className='card-detail-container'
        >
          <motion.div
            layoutId={`text-container-${book.id}`}
            className='text-container'
          >
            <Link href={`/book/${book.id}`} className='text-3xl'>
              <p className='font-semibold text-gray-100 text-3xl'>
                {book.title}
              </p>
            </Link>
            <p className='text-base text-gray-300 text-ellipsis line-clamp-6'>
              {book.description}
            </p>
          </motion.div>
          <motion.div layoutId={`add-to-shelf-${book.id}`}>
            <AddToShelfButton id={book.id.toString()} mini />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
export default BookCard;

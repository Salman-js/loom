import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '../../../components/ui/badge';
import { IShelf } from '../interface/shelf.interface';
import { motion } from 'framer-motion';

type ShelfCardProps = {
  shelf: IShelf;
};

const ShelfCard: React.FC<ShelfCardProps> = ({ shelf }) => {
  const { state } = useSidebar();
  return (
    <motion.div
      className={cn(
        'shelf-card border',
        state === 'expanded' ? 'h-[23em]' : 'h-[25em]'
      )}
    >
      <div className='grid grow grid-cols-2 h-[15em] gap-[2px]'>
        {shelf?.books.map((book) => (
          <div
            key={book.id} // Use book.id as the key
            className={`h-full overflow-hidden ${
              shelf.books.length % 2 !== 0 &&
              shelf.books.indexOf(book) === shelf.books.length - 1
                ? 'col-span-2'
                : ''
            }`}
          >
            <img
              src={book.cover}
              alt={`Cover of ${book.title}`}
              className='w-full h-full object-cover'
            />
          </div>
        ))}
      </div>
      <div className='w-full p-4'>
        <div className='w-full flex flex-row justify-between items-center'>
          <div>
            <Link href={`/shelves/${shelf.id}`}>
              <h2 className='text-3xl font-semibold text-foreground hover:underline'>
                {shelf.name}
              </h2>
            </Link>
          </div>
          <Badge>{shelf.books.length} books</Badge>
        </div>
        <p className='text-lg text-muted-foreground text-ellipsis line-clamp-2'>
          {shelf.description}
        </p>
      </div>
    </motion.div>
  );
};
export default ShelfCard;

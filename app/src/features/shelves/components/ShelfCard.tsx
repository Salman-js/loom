import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '../../../components/ui/badge';
import { IShelf } from '../interface/shelf.interface';

type ShelfCardProps = {
  shelf: IShelf;
};

const ShelfCard: React.FC<ShelfCardProps> = ({ shelf }) => {
  const { state } = useSidebar();
  return (
    <div
      className={cn(
        'shelf-card border',
        state === 'expanded' ? 'h-[23em]' : 'h-[25em]'
      )}
    >
      <div className='grid grow grid-cols-2 h-[15em] gap-[2px]'>
        {shelf?.books.map((book, index) => (
          <div
            key={index}
            className={`h-auto bg-cover bg-center bg-no-repeat ${
              index === shelf.books.length - 1 && shelf.books.length % 2 !== 0
                ? 'col-span-2'
                : ''
            }`}
            style={{
              backgroundImage: `url(${book.image})`,
            }}
          ></div>
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
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum,
          distinctio. Quaerat aperiam aliquam id alias. Laborum ipsum eum,
          voluptatibus esse commodi pariatur cum quod repellendus, perspiciatis
          qui ut, consequuntur ipsam!
        </p>
      </div>
    </div>
  );
};
export default ShelfCard;

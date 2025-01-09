import { shelves } from '@/lib/constants';
import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import ShelfCard from './ShelfCard';

type ShelvesProps = {
  searchText: string;
};

const Shelves: React.FC<ShelvesProps> = ({ searchText }) => {
  const { state } = useSidebar();
  return (
    <main
      className={cn(
        'home-main-container',
        state === 'expanded'
          ? 'lg:grid-cols-3 md:grid-cols-3'
          : 'lg:grid-cols-3 md:grid-cols-3'
      )}
    >
      {shelves
        .filter(
          (shelf) =>
            shelf.name.toLowerCase().includes(searchText.toLowerCase()) ||
            shelf.description?.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((shelf) => (
          <ShelfCard shelf={shelf} key={shelf.id} />
        ))}
    </main>
  );
};
export default Shelves;

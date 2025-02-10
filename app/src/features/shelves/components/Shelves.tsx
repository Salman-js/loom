import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import ShelfCard from './ShelfCard';
import { IShelf } from '../interface/shelf.interface';
import { AddShelfDialog } from './add-shelf';

type ShelvesProps = {
  shelves: IShelf[];
  addingNew: boolean;
  setAddingNew: React.Dispatch<React.SetStateAction<boolean>>;
};

const Shelves: React.FC<ShelvesProps> = ({
  shelves,
  addingNew,
  setAddingNew,
}) => {
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
      {addingNew && <AddShelfDialog open={addingNew} setOpen={setAddingNew} />}
      {shelves?.map((shelf) => (
        <ShelfCard shelf={shelf} key={shelf.id} />
      ))}
    </main>
  );
};
export default Shelves;

'use client';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, LibraryBig, Plus, Search, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import {
  PopoverBody,
  PopoverButton,
  PopoverContent,
  PopoverHeader,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFetchBookById } from '@/features/books/api/api.books';
import { useFetchShelvesLight } from '../api/api.shelves';

type FavoriteButtonProps = {
  id: string;
  mini?: boolean;
};

const AddToShelfButton: React.FC<FavoriteButtonProps> = ({
  id,
  mini = false,
}) => {
  const { toast } = useToast();
  const { data: book, isLoading } = useFetchBookById(id);
  const { data: shelves, isLoading: shelvesLoading } = useFetchShelvesLight();
  const [searchQuery, setSearchQuery] = React.useState('');
  return (
    <PopoverRoot>
      <PopoverTrigger
        variant='outline'
        size={mini ? 'icon' : 'default'}
        className={mini ? 'rounded-full' : undefined}
      >
        {mini ? (
          <Plus className={!mini ? 'mr-2' : undefined} />
        ) : (
          <LibraryBig className={!mini ? 'mr-2' : undefined} />
        )}
        {!mini && 'Add to Shelf'}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'p-0',
          mini ? 'absolute bottom-1/2 right-[1em]' : 'w-[300px]'
        )}
      >
        <div className='flex items-center gap-2 border-b px-3 py-2'>
          <Search className='h-4 w-4 text-muted-foreground' />
          <Input
            className='h-8 border-0 bg-transparent p-0 focus-visible:ring-0'
            placeholder='Search shelves...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <PopoverBody className='p-0'>
          <div className='p-2'>
            {shelves
              ?.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <PopoverButton
                  key={item.name}
                  onClick={() => console.log(`Clicked: ${item.name}`)}
                  className='relative w-full justify-between px-2 py-1.5 text-sm font-normal'
                >
                  <div className='flex just items-center gap-3'>
                    <span>{item.name}</span>
                  </div>
                  {item.books && (
                    <Badge
                      variant='secondary'
                      className='ml-auto h-5 px-1.5 text-xs'
                    >
                      {item.books?.length} books
                    </Badge>
                  )}
                </PopoverButton>
              ))}
          </div>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};
export default AddToShelfButton;

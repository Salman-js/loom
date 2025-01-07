'use client';
import React from 'react';
import { Button } from '../../ui/button';
import { Heart } from 'lucide-react';
import { books } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';

type FavoriteButtonProps = {
  id: string;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ id }) => {
  const { toast } = useToast();
  const book = books.find((book) => book.id === parseInt(id));
  return (
    <Button
      size='icon'
      variant='outline'
      className='rounded-full'
      onClick={(e) => {
        e.preventDefault();
        toast({
          title: `Book Saved`,
          description: `${book?.title} added to favorites`,
          action: <ToastAction altText='Undo'>Undo</ToastAction>,
        });
      }}
    >
      <Heart size={50} />
    </Button>
  );
};
export default FavoriteButton;

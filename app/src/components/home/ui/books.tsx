import { books } from '@/lib/constants';
import React from 'react';
import BookCard from './BookCard';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

type booksProps = {
  searchText: string;
};

const Books: React.FC<booksProps> = ({ searchText }) => {
  const { state } = useSidebar();
  return (
    <main
      className={cn(
        'home-main-container',
        state === 'expanded'
          ? 'lg:grid-cols-4 md:grid-cols-2'
          : 'lg:grid-cols-5 md:grid-cols-3'
      )}
    >
      {books
        .filter(
          (book) =>
            book.title.toLowerCase().includes(searchText.toLowerCase()) ||
            book.author.toLowerCase().includes(searchText.toLowerCase()) ||
            book.description.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((book) => (
          <BookCard book={book} key={book.id} />
        ))}
    </main>
  );
};
export default Books;

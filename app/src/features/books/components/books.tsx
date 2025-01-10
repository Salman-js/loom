import { books } from '@/lib/constants';
import React from 'react';
import BookCard from './BookCard';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

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
          ? 'lg:grid-cols-4 md:grid-cols-3'
          : 'lg:grid-cols-5 md:grid-cols-4'
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

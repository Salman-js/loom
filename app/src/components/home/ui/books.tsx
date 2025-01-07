import { books } from '@/lib/constants';
import React from 'react';
import BookCard from './BookCard';

type booksProps = {
  searchText: string;
};

const Books: React.FC<booksProps> = ({ searchText }) => {
  return (
    <main className='home-main-container'>
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

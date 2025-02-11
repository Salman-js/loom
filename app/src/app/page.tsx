'use client';
import Header from '@/components/ui/header/main-header';
import {
  useBookPagination,
  useFetchBooks,
} from '@/features/books/api/api.books';
import Books from '@/features/books/components/books';
import { useDeferredValue, useEffect, useState } from 'react';
export default function Home() {
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});
  const query = useDeferredValue(queryParams.search ?? '');
  const { page, pages, size, setPage, setSize } =
    useBookPagination(queryParams);
  const { data, refetch, isRefetching, isPending } = useFetchBooks(
    page,
    size,
    queryParams
  );
  const [addBookDialogOpen, setAddBookDialogOpen] = useState(false);
  return (
    <div className='w-full'>
      <Header
        searchText={query}
        onSearchTextChange={(value) =>
          setQueryParams({
            search: value,
          })
        }
        onAddNew={setAddBookDialogOpen}
        addingNew={addBookDialogOpen}
      />
      <div className='page-container'>
        <Books
          books={data ?? []}
          addingNew={addBookDialogOpen}
          setAddingNew={setAddBookDialogOpen}
          loading={isPending}
        />
      </div>
    </div>
  );
}

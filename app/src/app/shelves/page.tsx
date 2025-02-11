'use client';
import Header from '@/components/ui/header/main-header';
import {
  useFetchShelves,
  useShelfPagination,
} from '@/features/shelves/api/api.shelves';
import Shelves from '@/features/shelves/components/Shelves';
import { useDeferredValue, useState } from 'react';
export default function Home() {
  const [queryParams, setQueryParams] = useState<Record<string, any>>({});
  const query = useDeferredValue(queryParams.search ?? '');
  const { page, pages, size, setPage, setSize } =
    useShelfPagination(queryParams);
  const { data, refetch, isRefetching, isPending } = useFetchShelves(
    page,
    size,
    queryParams
  );
  const [addShelfDialogOpen, setAddShelfDialogOpen] = useState(false);
  return (
    <div className='w-full'>
      <Header
        searchText={query}
        onSearchTextChange={(value) =>
          setQueryParams({
            search: value,
          })
        }
        onAddNew={setAddShelfDialogOpen}
        addingNew={addShelfDialogOpen}
      />
      <div className='page-container bg-white'>
        <Shelves
          shelves={data ?? []}
          addingNew={addShelfDialogOpen}
          setAddingNew={setAddShelfDialogOpen}
          loading={isPending}
        />
      </div>
    </div>
  );
}

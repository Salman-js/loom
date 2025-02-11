import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAddShelf } from '../api/api.shelves';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { shelfSchema } from '../schemas/schema.shelf';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { useFetchBooksLight } from '@/features/books/api/api.books';

export function AddShelfDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof shelfSchema>>({
    resolver: zodResolver(shelfSchema),
    defaultValues: {
      name: '',
      description: '',
      books: [],
    },
  });
  const { isPending, mutateAsync, isSuccess } = useAddShelf({
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
  });

  const onSubmit = async (values: z.infer<typeof shelfSchema>) => {
    await mutateAsync({ ...values });
  };
  const { state } = useSidebar();
  const {
    data: books,
    refetch,
    isRefetching,
    isPending: isBooksPending,
  } = useFetchBooksLight();
  const selectedBooks = form.watch('books');
  const handleBookClick = (bookId: string) => {
    const newSelectedBooks = selectedBooks.includes(bookId)
      ? selectedBooks.filter((id) => id !== bookId)
      : [...selectedBooks, bookId];

    form.setValue('books', newSelectedBooks);
  };
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn('space-y-3 cursor-pointer rounded-xl border p-4')}
          >
            <div className='w-full flex flex-row justify-between'>
              <div>
                <p className='relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base'>
                  Add New Shelf
                </p>
              </div>
              <div>
                <Button variant='link' onClick={() => setOpen(false)}>
                  <X />
                </Button>
              </div>
            </div>
            <div
              className={cn(
                'space-y-3 overflow-auto p-2',
                state === 'expanded' ? 'h-[21em]' : 'h-[23em]'
              )}
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={String(field.value ?? '')} />
                    </FormControl>
                    <FormDescription>{field.value?.length}/200</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='books'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Books</FormLabel>
                    <FormControl>
                      <div className='w-full grid grid-cols-4 gap-4'>
                        {books?.map((book) => (
                          <div
                            key={book.id}
                            className='flex flex-col items-center justify-start relative cursor-pointer'
                            onClick={() => handleBookClick(book.id)}
                          >
                            <img
                              src={book.cover}
                              alt={book.title}
                              className='w-full object-cover'
                            />
                            <p className='text-xs'>{book.title}</p>
                            {field.value?.includes(book.id) && (
                              <div className='absolute top-2 right-2 p-1 bg-white rounded-full'>
                                <Check className='h-5 w-5 text-green-500' />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  'Add Shelf'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </AnimatePresence>
  );
}

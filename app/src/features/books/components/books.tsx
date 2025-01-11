import { books } from '@/lib/constants';
import React, { useEffect, useId, useRef, useState } from 'react';
import BookCard from './BookCard';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { IBook } from '../interface/book.interface';
import { useOutsideClick } from '@/hooks/use-outsideClick';
import { BookOpenText, Calendar1, X } from 'lucide-react';
import Link from 'next/link';
import AddToShelfButton from '@/features/shelves/components/add-to-shelf';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import BookDescription from './BookDescription';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';

type booksProps = {
  searchText: string;
};

const Books: React.FC<booksProps> = ({ searchText }) => {
  const { state } = useSidebar();
  const [active, setActive] = useState<IBook | boolean | null>(null);
  const isMobile = useIsMobile();
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(false);
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));
  useEffect(() => {
    if (isMobile) setActive(null);
  }, [isMobile]);
  return (
    <>
      <AnimatePresence>
        {active && typeof active === 'object' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/20 h-full w-full z-10'
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === 'object' ? (
          <div className='fixed inset-0  grid place-items-center z-[100]'>
            <motion.div
              layoutId={`book-card-${active.id}`}
              ref={ref}
              className='p-10 rounded-3xl bg-background w-1/2 flex flex-col lg:flex-row justify-start items-start gap-10'
              style={{
                height: state === 'expanded' ? '33em' : '30em',
              }}
            >
              <div className='w-1/2 h-full'>
                <motion.img
                  src={active.image}
                  layoutId={`img-${active.id}`}
                  className='h-full w-full rounded-2xl'
                ></motion.img>
              </div>
              <div className='w-full flex flex-col justify-start items-start pr-8 py-6'>
                <div>
                  <span className='text-base p-2 rounded-full text-muted-foreground px-4'>
                    {active?.author}
                  </span>
                </div>
                <div>
                  <motion.p
                    layoutId={`title-${active.id}`}
                    className='text-5xl text-foreground font-semibold my-3'
                  >
                    {active?.title}
                  </motion.p>
                </div>
                <div className='flex flex-row justify-start items-center gap-3'>
                  <Button
                    className='text-muted-foreground bg-muted rounded-full p-2 px-3'
                    size='sm'
                  >
                    <Calendar1 /> {dayjs().subtract(2, 'years').format('YYYY')}
                  </Button>
                  <Button
                    className='text-muted-foreground bg-muted rounded-full p-2 px-3'
                    size='sm'
                  >
                    Thriller
                  </Button>
                  <Button
                    className='text-muted-foreground bg-muted rounded-full p-2 px-3'
                    size='sm'
                  >
                    Drama
                  </Button>
                </div>
                <div className='flex flex-row justify-start items-center gap-3 mt-4'>
                  <Button size='sm'>
                    <BookOpenText /> Read
                  </Button>
                  <motion.div layoutId={`add-to-shelf-${active.id}`}>
                    <AddToShelfButton id={active.id.toString()} />
                  </motion.div>
                </div>
                <motion.p
                  layoutId={`description-${active.id}`}
                  className='mt-3'
                >
                  <BookDescription description={active?.description || ''} />
                </motion.p>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
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
            <motion.div
              layoutId={`book-card-${book.id}`}
              className='book-card group'
              style={{
                height: state === 'expanded' ? '33em' : '30em',
              }}
              onClick={() =>
                isMobile ? router.push(`/book/${book.id}`) : setActive(book)
              }
            >
              <motion.img
                src={book.image}
                layoutId={`img-${book.id}`}
                className='h-full w-full absolute'
              ></motion.img>
              <div className='card-container'>
                <div className='card-detail-container'>
                  <div className='text-container'>
                    <motion.p
                      layoutId={`title-${book.id}`}
                      className='font-semibold text-gray-100 text-3xl'
                    >
                      {book.title}
                    </motion.p>
                    <motion.p
                      layoutId={`description-${book.id}`}
                      className='text-base text-gray-300 text-ellipsis line-clamp-6'
                    >
                      {book.description}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </main>
    </>
  );
};
export default Books;

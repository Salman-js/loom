import { Button } from '@/components/ui/button';
import { Highlighter, Maximize2, Minimize2, Pencil } from 'lucide-react';
import React, { useEffect } from 'react';
import SwitchPageMode from './SwitchPageMode';
import { Tooltip } from '@/components/ui/factory/Tooltip';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useFetchBookWithDetails } from '../api/api.books';
import { Modal } from '@/components/ui/factory/Modal';
import { Rendition } from 'epubjs';

type ReaderControlsProps = {
  isSinglePage: boolean;
  toggle: () => void;
  toggleFullScreen: () => void;
  isFullScreen: boolean;
  selectionControls: React.ReactNode;
  bookId: string | undefined;
  onCfiClick: (cfiRange: string) => void;
  rendition: Rendition | undefined;
};

const ReaderControls: React.FC<ReaderControlsProps> = ({
  isSinglePage,
  toggleFullScreen,
  toggle,
  isFullScreen,
  selectionControls,
  bookId,
  onCfiClick,
  rendition,
}) => {
  const { theme } = useTheme();
  const {
    data: book,
    isLoading,
    refetch,
    error,
  } = useFetchBookWithDetails(bookId);
  useEffect(() => {
    if (book) {
      book?.highlights.forEach((h) => {
        if (rendition) {
          rendition.annotations.add(
            'highlight',
            h.cfiRange,
            {},
            (e: MouseEvent) => {},
            'hl',
            {
              fill: h.color,
              'fill-opacity': '0.5',
              'mix-blend-mode': 'multiply',
            }
          );
        }
      });
    }
  }, [book, rendition]);
  return (
    <div
      className={cn(
        'w-full flex flex-row justify-between items-center px-10 py-4',
        isFullScreen &&
          'fixed z-10 opacity-0 hover:opacity-100 bg-gradient-to-b from-transparent to-muted-foreground transition-all duration-300 ease-in-out',
        isFullScreen &&
          theme === 'dark' &&
          'bg-gradient-to-b from-transparent to-muted'
      )}
    >
      <div className='flex flex-row space-x-2 w-1/3'>
        {!isFullScreen && (
          <>
            <Modal
              trigger={
                <Button variant='outline'>
                  <Pencil /> Notes
                </Button>
              }
              title='Notes'
            >
              <div className='flex flex-col space-y-2'>
                {book?.notes.map((h) => (
                  <div
                    className='p-3 rounded-lg border w-full flex flex-row justify-between items-center cursor-pointer'
                    onClick={() => onCfiClick(h.cfiRange)}
                    key={h.id}
                  >
                    <div>{h.text}</div>
                  </div>
                ))}
              </div>
            </Modal>
            <Modal
              trigger={
                <Button variant='outline'>
                  <Highlighter />
                  Highlights
                </Button>
              }
              title='Highlights'
            >
              <div className='flex flex-col space-y-2'>
                {book?.highlights.map((h) => (
                  <div
                    className='p-3 rounded-lg border w-full flex flex-row justify-between  cursor-pointer'
                    onClick={() => onCfiClick(h.cfiRange)}
                    key={h.id}
                  >
                    <div>{h.text}</div>
                    <div
                      className='p-4 rounded-lg'
                      style={{
                        backgroundColor: h.color,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </Modal>
          </>
        )}
        {selectionControls}
      </div>
      <div className='flex flex-row justify-end space-x-2 items-center w-1/3'>
        <Button variant='outline' size='icon' onClick={toggleFullScreen}>
          {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </Button>
        {/* <SwitchPageMode isSinglePage={isSinglePage} toggle={toggle} /> */}
      </div>
    </div>
  );
};
export default ReaderControls;

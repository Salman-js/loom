'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IReactReaderStyle, ReactReader, ReactReaderStyle } from 'react-reader';
import { Contents, NavItem, type Rendition } from 'epubjs';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import AddNotePopover from '../AddNote';
import { Button } from '@/components/ui/button';
import { Copy, Fullscreen, Loader2 } from 'lucide-react';
import AddHighlightPopover from '../AddHighilight';
import { useReaderStyle } from '../../hooks/use-reader-style';
import { ReaderStyleState } from '@/store/store';
import CopyToClipBoard from '../CopyToClipBoard';
import SwitchPageMode from '../SwitchPageMode';
import ReaderControls from '../ReaderControls';
import { useParams } from 'next/navigation';
import { useFetchBookById } from '../../api/api.books';
import { useReaderLocation } from '../../hooks/use-reader-location';
import { cn } from '@/lib/utils';

type readerProps = {};

function updateTheme(rendition: Rendition, styles: ReaderStyleState) {
  const themes = rendition.themes;
  themes.override('color', styles.text as string);
  themes.override('background', styles.background as string);
  themes.override('font-family', styles.fontFamily as string);
  themes.override('font-size', styles.fontSize as string);
}
export type ITextSelection = {
  text: string;
  cfiRange: string;
};
const Reader: React.FC<readerProps> = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { data: book, isLoading, refetch, error } = useFetchBookById(id);
  const { background, text, fontFamily, fontSize } = useReaderStyle();
  const { location, setLocation, setUrl, activeChapter } = useReaderLocation();
  const [chapterPage, setChapterPage] = useState(0);
  const [currentSelection, setSelection] = useState<ITextSelection | null>();
  const { theme } = useTheme();
  const [highlights, setHighlights] = useState<
    (ITextSelection & { color: string })[]
  >([]);
  const [isSinglePage, setIsSinglePage] = useState(false);
  const [notes, setNotes] = useState<(ITextSelection & { note: string })[]>([]);
  const toc = useRef<NavItem[]>([]);

  const [rendition, setRendition] = useState<Rendition | undefined>(undefined);
  const readerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const goFullscreen = () => {
    if (readerRef.current) {
      if (readerRef.current.requestFullscreen) {
        readerRef.current.requestFullscreen({
          navigationUI: 'show',
        });
      }
    }
  };
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
  const toggleFullScreen = () => {
    if (isFullScreen) {
      exitFullscreen();
    } else {
      goFullscreen();
    }
  };
  const toggleMode = () => {
    if (rendition) {
      const currentLocation = rendition.currentLocation();
      const tempLocation = (currentLocation as any)?.start?.cfi;

      const newSpread = isSinglePage ? 'auto' : 'none';
      rendition.spread(newSpread);

      rendition.display();

      setIsSinglePage(!isSinglePage);
      setLocation(tempLocation);
    }
  };
  const handleHighlight = (color: string) => {
    if (rendition && currentSelection) {
      setHighlights((prev) => [...prev, { ...currentSelection, color }]);
    }
  };

  const handleRemoveHighlight = () => {
    if (rendition && currentSelection) {
      setHighlights((prev) =>
        prev.filter((h) => h.cfiRange !== currentSelection.cfiRange)
      );
    }
  };
  const handleAddNote = (text: string) => {
    if (rendition && currentSelection) {
      handleRemoveNote();
      setNotes((prev) => [...prev, { ...currentSelection, note: text }]);
    }
  };
  const handleRemoveNote = () => {
    if (rendition && currentSelection) {
      setNotes((prev) =>
        prev.filter((n) => n.cfiRange !== currentSelection.cfiRange)
      );
    }
  };
  useEffect(() => {
    if (rendition) {
      updateTheme(rendition, {
        background,
        text,
        fontFamily,
        fontSize,
      });
    }
  }, [rendition, background, text, fontFamily, fontSize]);
  useEffect(() => {
    if (rendition) {
      const setRenderSelection = (cfiRange: string, contents: Contents) => {
        if (rendition) {
          setTimeout(() => {
            const selectedText = rendition.getRange(cfiRange).toString();
            setSelection({
              text: selectedText,
              cfiRange,
            });
          }, 500);
        }
      };
      rendition.on('selected', setRenderSelection);

      return () => {
        rendition.off('selected', setRenderSelection);
      };
    }
  }, [rendition]);

  useEffect(() => {
    if (rendition) {
      const handleClick = () => setSelection(null);

      rendition.on('click', handleClick);
      return () => {
        rendition.off('click', handleClick);
      };
    }
  }, [rendition]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);
  const cfiRangeChange = (cfiRange: string) => {
    if (rendition) rendition.display(cfiRange);
  };
  useEffect(() => {
    if (book) setUrl(book.path);
  }, [book]);
  useEffect(() => {
    if (activeChapter) {
      if (rendition) {
        rendition.display(activeChapter);
      }
    }
  }, [activeChapter]);
  return (
    <div
      className={`${
        isSinglePage ? 'w-full lg:w-1/2' : 'w-full'
      } flex flex-col h-[90vh] mx-auto z-10`}
      ref={readerRef}
    >
      <ReaderControls
        isSinglePage={isSinglePage}
        toggle={toggleMode}
        toggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
        bookId={book?.id}
        onCfiClick={cfiRangeChange}
        rendition={rendition}
        selectionControls={
          <AnimatePresence>
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: 'auto',
              }}
              exit={{
                width: 0,
              }}
              transition={{ duration: 0.15 }}
              className={cn(
                'flex flex-row justify-center items-center space-x-1 border rounded-md shadow-sm',
                isFullScreen && 'bg-background'
              )}
            >
              <CopyToClipBoard
                currentSelection={currentSelection}
                disabled={!currentSelection}
              />
              <AddHighlightPopover
                onAfterHighlight={handleHighlight}
                highlights={highlights}
                onAfterUnhighlight={() => handleRemoveHighlight()}
                currentSelection={currentSelection}
                rendition={rendition}
                bookId={book?.id ?? ''}
                disabled={!currentSelection}
              />
              <AddNotePopover
                onAfterSave={handleAddNote}
                onAfterDelete={handleRemoveNote}
                currentSelection={currentSelection}
                notes={notes}
                rendition={rendition}
                bookId={book?.id ?? ''}
                disabled={!currentSelection}
                isFullScreen={isFullScreen}
              />
            </motion.div>
          </AnimatePresence>
        }
      />
      {book ? (
        <ReactReader
          url={book.path ?? ''}
          location={location}
          locationChanged={(epubcfi: string) => {
            if (rendition && toc.current) {
              const { displayed, href } = rendition?.location.start;
              setChapterPage(displayed.page);
            }
          }}
          readerStyles={{
            ...getStyle(theme),
          }}
          getRendition={(_rendition: Rendition) => {
            setRendition(_rendition);
            if (rendition) {
              (rendition as any).current = _rendition;
              _rendition.hooks.content.register((contents: Contents) => {
                const document = contents.window.document;
                if (document) {
                  const css = `
                  @font-face {
                    font-family: "Times New Roman";
                    font-weight: 400;
                    font-style: normal;
                    font-size: ${fontSize}px;
                    src: url("https://fonts.cdnfonts.com/s/57197/times.woff") format('woff');
              }
              `;
                  const style = document.createElement('style');
                  style.appendChild(document.createTextNode(css));
                  document.head.appendChild(style);
                }
              });
              updateTheme(rendition, {
                background,
                text,
                fontFamily: 'Times New Roman',
                fontSize,
              });
            }
          }}
          loadingView={
            <div className='w-full h-full flex flex-col justify-center items-center'>
              <Loader2 className='h-24 w-24 animate-spin' />
            </div>
          }
          epubViewStyles={{
            viewHolder: {
              height: '100%',
              width: '100%', // Ensure full width
              zIndex: 5,
            },
            view: {
              height: '100%',
              width: '100%', // Ensure full width
              zIndex: 5,
            },
          }}
          epubOptions={{
            allowScriptedContent: true,
            allowPopups: true,
          }}
        />
      ) : isLoading ? (
        <div className='w-full h-full flex flex-col justify-center items-center'>
          <Loader2 className='h-24 w-24 animate-spin' />
        </div>
      ) : null}
    </div>
  );
};
const getStyle = (theme?: string): IReactReaderStyle => {
  const lightTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      transition: undefined,
    },
  };
  const darkTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    arrow: {
      ...ReactReaderStyle.arrow,
      color: 'white',
    },
    arrowHover: {
      ...ReactReaderStyle.arrowHover,
      color: '#ccc',
    },
    readerArea: {
      ...ReactReaderStyle.readerArea,
      backgroundColor: '#000',
      transition: undefined,
    },
    titleArea: {
      ...ReactReaderStyle.titleArea,
      color: '#ccc',
    },
    tocArea: {
      ...ReactReaderStyle.tocArea,
      background: '#111',
      display: 'none',
    },
    tocButtonExpanded: {
      ...ReactReaderStyle.tocButtonExpanded,
      background: '#222',
      display: 'none',
    },
    tocButtonBar: {
      ...ReactReaderStyle.tocButtonBar,
      background: '#fff',
      display: 'none',
    },
    tocButton: {
      ...ReactReaderStyle.tocButton,
      color: 'white',
      display: 'none',
    },
  };
  const readerTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    ...(theme === 'dark' ? darkTheme : lightTheme),
    reader: {
      ...ReactReaderStyle.reader,
      fontFamily: 'Verdana',
    },
  };
  return readerTheme;
};
export default Reader;

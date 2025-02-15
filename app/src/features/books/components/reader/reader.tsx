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
  const { location, setLocation } = useReaderLocation();
  const [chapterPage, setChapterPage] = useState(0);
  const [currentSelection, setSelection] = useState<ITextSelection | null>();
  const { theme } = useTheme();
  const [highlights, setHighlights] = useState<
    (ITextSelection & { color: string })[]
  >([]);
  const [isSinglePage, setIsSinglePage] = useState(false);
  const [notes, setNotes] = useState<(ITextSelection & { note: string })[]>([]);
  const toc = useRef<NavItem[]>([]);
  const [buttonPosition, setButtonPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [rendition, setRendition] = useState<Rendition | undefined>(undefined);
  const readerRef = useRef<HTMLDivElement>(null);

  const goFullscreen = () => {
    if (readerRef.current) {
      if (readerRef.current.requestFullscreen) {
        readerRef.current.requestFullscreen();
      }
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
      rendition.annotations.add(
        'highlight',
        currentSelection.cfiRange,
        {},
        (e: MouseEvent) => {},
        'hl',
        {
          fill: color,
          'fill-opacity': '0.5',
          'mix-blend-mode': 'multiply',
        }
      );
      setHighlights((prev) => [...prev, { ...currentSelection, color }]);
    }
  };

  const handleRemoveHighlight = () => {
    if (rendition && currentSelection) {
      // Correctly remove the highlight annotation
      rendition.annotations.remove(currentSelection.cfiRange, 'highlight');

      // Update the highlights state
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
            const selection = contents.window.getSelection();
            if (selection?.rangeCount) {
              const range = selection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              setButtonPosition({
                x: rect.left + contents.window.scrollX,
                y: rect.bottom + contents.window.scrollY,
              });
            }
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
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    if (rendition) {
      const handleMouseDown = () => setIsMouseDown(true);
      const handleMouseUp = () => setIsMouseDown(false);

      const handleClick = () => {
        if (!isMouseDown) {
          setButtonPosition(null);
        }
      };

      // Attach mousedown and mouseup listeners to track mouse state
      rendition.on('mousedown', handleMouseDown);
      rendition.on('mouseup', handleMouseUp);

      // Attach the click event listener
      rendition.on('click', handleClick);
      // Cleanup all listeners when the component unmounts or rendition changes
      return () => {
        rendition.off('mousedown', handleMouseDown);
        rendition.off('mouseup', handleMouseUp);
        rendition.off('click', handleClick);
      };
    }
  }, [rendition, isMouseDown]);
  return (
    <div
      className={`${
        isSinglePage ? 'w-full lg:w-1/2' : 'w-full'
      } flex flex-col h-[90vh] mx-auto`}
      ref={readerRef}
    >
      <ReaderControls
        isSinglePage={isSinglePage}
        toggle={toggleMode}
        onFullScreen={goFullscreen}
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
          getRendition={(rend: Rendition) => setRendition(rend)}
          loadingView={
            <div className='w-full h-full flex flex-col justify-center items-center'>
              <Loader2 className='h-24 w-24 animate-spin' />
            </div>
          }
          epubViewStyles={{
            viewHolder: {
              height: '100%',
              width: '100%', // Ensure full width
            },
            view: {
              height: '100%',
              width: '100%', // Ensure full width
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
      {buttonPosition && (
        <AnimatePresence>
          <motion.div
            style={{
              position: 'absolute',
              left:
                buttonPosition.x +
                70 -
                (chapterPage - 1) * 770 -
                chapterPage * 13,
              top: buttonPosition.y + 170,
              zIndex: 49,
            }}
            initial={{
              height: 0,
            }}
            animate={{
              height: 'auto',
            }}
            transition={{ duration: 0.15 }}
            className='flex flex-row justify-center items-center space-x-1 p-1 rounded-xl bg-secondary shadow-md border'
          >
            <CopyToClipBoard currentSelection={currentSelection} />
            <AddHighlightPopover
              onSelect={handleHighlight}
              highlighted={highlights.some(
                (h) => h.cfiRange === currentSelection?.cfiRange
              )}
              onUnHighlight={() => handleRemoveHighlight()}
            />
            <AddNotePopover
              onSave={handleAddNote}
              onDelete={handleRemoveNote}
              currentSelection={currentSelection}
              notes={notes}
            />
          </motion.div>
        </AnimatePresence>
      )}
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
    },
    tocButtonExpanded: {
      ...ReactReaderStyle.tocButtonExpanded,
      background: '#222',
    },
    tocButtonBar: {
      ...ReactReaderStyle.tocButtonBar,
      background: '#fff',
    },
    tocButton: {
      ...ReactReaderStyle.tocButton,
      color: 'white',
    },
  };
  const readerTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    ...(theme === 'dark' ? darkTheme : lightTheme),
  };
  return readerTheme;
};
export default Reader;

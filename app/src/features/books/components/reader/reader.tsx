'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IReactReaderStyle, ReactReader, ReactReaderStyle } from 'react-reader';
import { Contents, type Rendition } from 'epubjs';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import AddNotePopover from '../AddNote';
import { Button } from '@/components/ui/button';
import { Copy, Highlighter } from 'lucide-react';
import AddHighlightPopover from '../AddHighilight';

type readerProps = {};

function updateTheme(rendition: Rendition, theme: string | undefined) {
  const themes = rendition.themes;
  switch (theme) {
    case 'dark': {
      themes.override('color', '#fff');
      themes.override('background', '#000');
      break;
    }
    case 'light': {
      themes.override('color', '#000');
      themes.override('background', '#fff');
      break;
    }
  }
}
type ITextSelection = {
  text: string;
  cfiRange: string;
};
const Reader: React.FC<readerProps> = () => {
  const [location, setLocation] = useState<string | number>(0);
  const [selections, setSelections] = useState<ITextSelection[]>([]);
  const [buttonPosition, setButtonPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [rendition, setRendition] = useState<Rendition | undefined>(undefined);
  const { theme } = useTheme();

  useEffect(() => {
    if (rendition) {
      updateTheme(rendition, theme);
    }
  }, [theme]);
  useEffect(() => {
    if (rendition) {
      const setRenderSelection = (cfiRange: string, contents: Contents) => {
        if (rendition) {
          // Get the selected text
          const selectedText = rendition.getRange(cfiRange).toString();

          // Highlight the selection
          rendition.annotations.add(
            'highlight',
            cfiRange,
            {},
            (e: MouseEvent) => console.log('Click on selection', cfiRange, e),
            'hl',
            {
              fill: 'skyblue',
              'fill-opacity': '0.5',
              'mix-blend-mode': 'multiply',
            }
          );

          // Capture mouse position
          const selection = contents.window.getSelection();
          if (selection?.rangeCount) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setButtonPosition({
              x: rect.left + contents.window.scrollX,
              y: rect.bottom + contents.window.scrollY,
            });
          }

          // Add the selection to the list
          setSelections((list) =>
            list.concat({
              text: selectedText,
              cfiRange,
            })
          );
          rendition.annotations.remove('hl', cfiRange);
          // Clear the selection
          selection?.removeAllRanges();
        }
      };

      // Listen for selection events
      rendition.on('selected', setRenderSelection);

      return () => {
        rendition.off('selected', setRenderSelection);
      };
    }
  }, [rendition]);
  useEffect(() => {
    if (rendition) {
      const handleClick = () => setButtonPosition(null);

      // Attach the click event listener
      rendition.on('click', handleClick);

      // Cleanup the listener when the component unmounts or rendition changes
      return () => {
        rendition.off('click', handleClick);
      };
    }
  }, [rendition]);
  return (
    <div className='w-full h-[90vh]'>
      <ReactReader
        url='https://react-reader.metabits.no/files/alice.epub'
        location={location}
        locationChanged={(epubcfi: string) => {
          setLocation(epubcfi);
        }}
        readerStyles={theme === 'dark' ? darkReaderTheme : lightReaderTheme}
        getRendition={(rend: Rendition) => setRendition(rend)}
        loadingView={<div>Loading...</div>}
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
      />
      {buttonPosition && (
        <AnimatePresence>
          <motion.div
            style={{
              position: 'absolute',
              left: buttonPosition.x + 70,
              top: buttonPosition.y + 120,
              zIndex: 1000,
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
            <Button size='icon' variant='link'>
              <Copy />
            </Button>
            <AddHighlightPopover />
            <AddNotePopover />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
const lightReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
  },
};

const darkReaderTheme: IReactReaderStyle = {
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
export default Reader;

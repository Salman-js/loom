import { Button } from '@/components/ui/button';
import { Highlighter, Maximize2, Minimize2, Pencil } from 'lucide-react';
import React from 'react';
import SwitchPageMode from './SwitchPageMode';
import { Tooltip } from '@/components/ui/factory/Tooltip';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

type ReaderControlsProps = {
  isSinglePage: boolean;
  toggle: () => void;
  toggleFullScreen: () => void;
  isFullScreen: boolean;
};

const ReaderControls: React.FC<ReaderControlsProps> = ({
  isSinglePage,
  toggleFullScreen,
  toggle,
  isFullScreen,
}) => {
  const { theme } = useTheme();
  return (
    <div
      className={cn(
        'w-full flex flex-row justify-between items-center px-10 py-4',
        isFullScreen &&
          'fixed bottom-0 z-10 opacity-0 hover:opacity-100 bg-gradient-to-b from-transparent to-muted-foreground transition-all duration-300 ease-in-out',
        isFullScreen &&
          theme === 'dark' &&
          'bg-gradient-to-b from-transparent to-muted'
      )}
    >
      <div className='flex flex-row space-x-2'>
        <Button variant='outline'>
          <Pencil /> Notes
        </Button>
        <Button variant='outline'>
          <Highlighter />
          Highlights
        </Button>
      </div>
      <div className='flex flex-row space-x-2 items-center'>
        <Tooltip content='Fullscreen'>
          <Button variant='outline' size='icon' onClick={toggleFullScreen}>
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
        </Tooltip>
        {/* <SwitchPageMode isSinglePage={isSinglePage} toggle={toggle} /> */}
      </div>
    </div>
  );
};
export default ReaderControls;

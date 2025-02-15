import { Button } from '@/components/ui/button';
import { Highlighter, Maximize2, Pencil } from 'lucide-react';
import React from 'react';
import SwitchPageMode from './SwitchPageMode';
import { Tooltip } from '@/components/ui/factory/Tooltip';

type ReaderControlsProps = {
  isSinglePage: boolean;
  toggle: () => void;
  onFullScreen: () => void;
};

const ReaderControls: React.FC<ReaderControlsProps> = ({
  isSinglePage,
  onFullScreen,
  toggle,
}) => {
  return (
    <div className='w-full flex flex-row justify-between items-center px-10 py-4'>
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
          <Maximize2 onClick={onFullScreen} size={18} />
        </Tooltip>
        <SwitchPageMode isSinglePage={isSinglePage} toggle={toggle} />
      </div>
    </div>
  );
};
export default ReaderControls;

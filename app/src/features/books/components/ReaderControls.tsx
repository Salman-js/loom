import { Button } from '@/components/ui/button';
import { Maximize2 } from 'lucide-react';
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
    <div className='w-full flex flex-row justify-end space-x-1 px-10 py-0'>
      <Tooltip content='Fullscreen'>
        <Button size='icon' onClick={onFullScreen} variant='link'>
          <Maximize2 />
        </Button>
      </Tooltip>
      <SwitchPageMode isSinglePage={isSinglePage} toggle={toggle} />
    </div>
  );
};
export default ReaderControls;

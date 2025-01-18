import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/factory/Tooltip';
import { BookOpenText, FileText } from 'lucide-react';
import React from 'react';

type SwitchPageModeProps = {
  isSinglePage: boolean;
  toggle: () => void;
};

const SwitchPageMode: React.FC<SwitchPageModeProps> = ({
  isSinglePage,
  toggle,
}) => {
  return (
    <div>
      <Tooltip content={isSinglePage ? 'Double Page' : 'Single Page'}>
        <Button
          size='icon'
          variant='link'
          onClick={toggle}
          className='flex flex-col justify-center items-center'
        >
          <FileText
            className={`${
              isSinglePage ? 'scale-0' : 'scale-100'
            } transition-all duration-300`}
          />
          <BookOpenText
            className={`${
              isSinglePage ? 'scale-100' : 'scale-0'
            } absolute m-auto transition-all duration-300`}
          />
        </Button>
      </Tooltip>
    </div>
  );
};
export default SwitchPageMode;

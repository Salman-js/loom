'use client';

import {
  PopoverForm,
  PopoverLabel,
  PopoverTextarea,
  PopoverFooter,
  PopoverCloseButton,
} from '@/components/ui/popover';
import { Highlighter, Pencil, Save } from 'lucide-react';
import Popover from '../../../components/ui/factory/Popover';

const highlightColors = ['red', 'yellow', 'green', 'blue', 'purple', 'orange'];
export default function AddHighlightPopover() {
  return (
    <Popover
      trigger={<Highlighter />}
      withCloseButton={false}
      className='top-[2.7rem] flex flex-row space-x-1 p-1 bg-secondary'
    >
      {highlightColors.map((color) => (
        <div className='p-1'>
          <div
            className={`p-3 rounded-md bg-[${color}]`}
            style={{
              backgroundColor: color,
            }}
          ></div>
        </div>
      ))}
    </Popover>
  );
}

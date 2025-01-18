'use client';

import { Highlighter, Pencil, Save, X } from 'lucide-react';
import Popover from '../../../components/ui/factory/Popover';
import { Tooltip } from '@/components/ui/factory/Tooltip';

const highlightColors = ['red', 'yellow', 'green', 'blue', 'purple', 'orange'];
export default function AddHighlightPopover({
  onSelect,
  highlighted,
  onUnHighlight,
}: {
  onSelect: (color: string) => void;
  highlighted?: boolean;
  onUnHighlight?: () => void;
}) {
  return (
    <Popover
      trigger={
        <Tooltip content='Highlight'>
          <Highlighter />
        </Tooltip>
      }
      withCloseButton={false}
      className='top-[2.7rem] flex flex-row space-x-1 p-1 bg-secondary'
    >
      {highlightColors.map((color) => (
        <div className='p-1 cursor-pointer'>
          <div
            className={`p-3 rounded-md bg-[${color}]`}
            style={{
              backgroundColor: color,
            }}
            onClick={() => onSelect(color)}
          ></div>
        </div>
      ))}
      {highlighted && (
        <div className='p-1 cursor-pointer'>
          <X onClick={onUnHighlight} />
        </div>
      )}
    </Popover>
  );
}

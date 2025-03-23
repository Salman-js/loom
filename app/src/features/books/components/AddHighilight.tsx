'use client';

import { Highlighter, Pencil, Save, X } from 'lucide-react';
import Popover from '../../../components/ui/factory/Popover';
import { Tooltip } from '@/components/ui/factory/Tooltip';
import { Rendition } from 'epubjs';
import { ITextSelection } from './reader/reader';
import { useAddHighlight, useDeleteHighlight } from '../api/api.books';

const highlightColors = ['red', 'yellow', 'green', 'blue', 'purple', 'orange'];
export default function AddHighlightPopover({
  onAfterHighlight,
  onAfterUnhighlight,
  bookId,
  rendition,
  currentSelection,
  highlights,
  disabled,
}: {
  onAfterHighlight: (color: string) => void;
  onAfterUnhighlight: () => void;
  bookId: string;
  rendition: Rendition | undefined;
  currentSelection: ITextSelection | null | undefined;
  highlights: (ITextSelection & { color: string })[];
  disabled: boolean;
}) {
  const highlighted = highlights.some(
    (h) => h.cfiRange === currentSelection?.cfiRange
  );
  const { isPending, mutateAsync } = useAddHighlight(bookId, {});
  const { isPending: isDeletePending, mutateAsync: deleteAsync } =
    useDeleteHighlight(bookId, {});
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
      mutateAsync({
        ...currentSelection,
        color,
      });
      onAfterHighlight?.(color);
    }
  };

  const handleRemoveHighlight = () => {
    if (rendition && currentSelection) {
      rendition.annotations.remove(currentSelection.cfiRange, 'highlight');
      deleteAsync({
        cfiRange: currentSelection?.cfiRange,
      });
      onAfterUnhighlight?.();
    }
  };

  return (
    <Popover
      trigger={<Highlighter />}
      disabled={disabled}
      withCloseButton={false}
      className='z-50 bg-secondary'
    >
      <div className='w-full flex flex-row'>
        {highlightColors.map((color) => (
          <div className='p-1 cursor-pointer' key={color}>
            <div
              className={`p-3 rounded-md bg-[${color}]`}
              style={{
                backgroundColor: color,
              }}
              onClick={() => handleHighlight(color)}
            ></div>
          </div>
        ))}
        {highlighted && (
          <div className='p-1 cursor-pointer'>
            <X onClick={handleRemoveHighlight} />
          </div>
        )}
      </div>
    </Popover>
  );
}

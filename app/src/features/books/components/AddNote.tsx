'use client';

import {
  PopoverForm,
  PopoverLabel,
  PopoverTextarea,
  PopoverFooter,
  PopoverCloseButton,
} from '@/components/ui/popover';
import { Loader2, Pencil, Save, Trash } from 'lucide-react';
import Popover from '../../../components/ui/factory/Popover';
import { Button } from '../../../components/ui/button';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ITextSelection } from './reader/reader';
import { Tooltip } from '@/components/ui/factory/Tooltip';
import { Rendition } from 'epubjs';
import { useAddNote, useDeleteNote } from '../api/api.books';
import { cn } from '@/lib/utils';

type addNoteProps = {
  onAfterSave: (text: string) => void;
  onAfterDelete: () => void;
  currentSelection?: ITextSelection | null;
  notes: (ITextSelection & { note: string })[];
  rendition: Rendition | undefined;
  bookId: string;
  disabled?: boolean;
  isFullScreen: boolean;
};
export default function AddNotePopover({
  onAfterSave,
  onAfterDelete,
  currentSelection,
  notes,
  rendition,
  bookId,
  disabled = false,
  isFullScreen,
}: addNoteProps) {
  const hasExistingNote = notes.some(
    (note) => note.cfiRange === currentSelection?.cfiRange
  );
  const [noteText, setNoteText] = useState('');
  const { isPending, mutateAsync } = useAddNote(bookId, {});
  const { isPending: isDeletePending, mutateAsync: deleteAsync } =
    useDeleteNote(bookId, {});
  const setDefaultNote = () => {
    const defaultNote = notes.find(
      (note) => note.cfiRange === currentSelection?.cfiRange
    );
    setNoteText(defaultNote?.note || '');
  };
  const handleDelete = () => {
    setNoteText('');
    deleteAsync({
      bookId,
      cfiRange: currentSelection?.cfiRange,
    });
    onAfterDelete?.();
  };
  const handleAddNote = async (text: string) => {
    if (rendition && currentSelection) {
      handleRemoveNote();
      mutateAsync({
        ...currentSelection,
        note: noteText,
      });
      onAfterSave?.(text);
    }
  };
  const handleRemoveNote = () => {
    if (rendition && currentSelection) {
      onAfterDelete?.();
    }
  };
  useEffect(() => {
    if (currentSelection) setDefaultNote();
  }, [currentSelection, notes]);
  return (
    <Popover
      trigger={<Pencil />}
      withCloseButton={false}
      disabled={disabled}
      className={cn(
        'top-[2.7rem] h-[200px] w-[364px]',
        isFullScreen && 'left-[0rem]'
      )}
    >
      <PopoverCloseButton className='absolute top-2 right-2' />
      <PopoverForm onSubmit={(note) => handleAddNote(note)}>
        <PopoverLabel>Add Note</PopoverLabel>
        <PopoverTextarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <PopoverFooter>
          <div>
            {hasExistingNote && (
              <Button
                type='button'
                size='icon'
                variant='secondary'
                title='Delete'
                onClick={handleDelete}
              >
                {isDeletePending ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  <Trash />
                )}
              </Button>
            )}
          </div>
          <Button type='submit' size='icon' variant='secondary' title='Save'>
            {isPending ? <Loader2 className='animate-spin' /> : <Save />}
          </Button>
        </PopoverFooter>
      </PopoverForm>
    </Popover>
  );
}

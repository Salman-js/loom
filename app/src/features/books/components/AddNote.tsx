'use client';

import {
  PopoverForm,
  PopoverLabel,
  PopoverTextarea,
  PopoverFooter,
  PopoverCloseButton,
} from '@/components/ui/popover';
import { Pencil, Save, Trash } from 'lucide-react';
import Popover from '../../../components/ui/factory/Popover';
import { Button } from '../../../components/ui/button';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ITextSelection } from './reader/reader';
import { Tooltip } from '@/components/ui/factory/Tooltip';

type addNoteProps = {
  onSave: (text: string) => void;
  onDelete: () => void;
  currentSelection?: ITextSelection | null;
  notes: (ITextSelection & { note: string })[];
};
export default function AddNotePopover({
  onSave,
  onDelete,
  currentSelection,
  notes,
}: addNoteProps) {
  const hasExistingNote = notes.some(
    (note) => note.cfiRange === currentSelection?.cfiRange
  );
  const [noteText, setNoteText] = useState('');
  const setDefaultNote = () => {
    const defaultNote = notes.find(
      (note) => note.cfiRange === currentSelection?.cfiRange
    );
    setNoteText(defaultNote?.note || '');
  };
  const handleDelete = () => {
    setNoteText('');
    onDelete();
  };
  useEffect(() => {
    if (currentSelection) setDefaultNote();
  }, [currentSelection, notes]);
  return (
    <Popover
      trigger={
        <Tooltip content='Add Note'>
          <Pencil />
        </Tooltip>
      }
      withCloseButton={false}
      className='top-[2.7rem] h-[200px] w-[364px]'
    >
      <PopoverCloseButton className='absolute top-2 right-2' />
      <PopoverForm onSubmit={(note) => onSave(note)}>
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
                <Trash />
              </Button>
            )}
          </div>
          <Button type='submit' size='icon' variant='secondary' title='Save'>
            <Save />
          </Button>
        </PopoverFooter>
      </PopoverForm>
    </Popover>
  );
}

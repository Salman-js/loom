'use client';

import {
  PopoverForm,
  PopoverLabel,
  PopoverTextarea,
  PopoverFooter,
  PopoverCloseButton,
} from '@/components/ui/popover';
import { Pencil, Save } from 'lucide-react';
import Popover from '../../../components/ui/factory/Popover';
import { Button } from '../../../components/ui/button';

export default function AddNotePopover() {
  return (
    <Popover trigger={<Pencil />} withCloseButton={false}>
      <PopoverForm onSubmit={(note) => console.log('Note submitted:', note)}>
        <PopoverLabel>Add Note</PopoverLabel>
        <PopoverTextarea />
        <PopoverFooter>
          <PopoverCloseButton />
          <Button type='submit' size='icon' variant='secondary' title='Save'>
            <Save />
          </Button>
        </PopoverFooter>
      </PopoverForm>
    </Popover>
  );
}

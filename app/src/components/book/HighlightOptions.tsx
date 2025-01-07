'use client';

import {
  PopoverForm,
  PopoverLabel,
  PopoverTextarea,
  PopoverFooter,
  PopoverCloseButton,
} from '@/components/ui/popover';
import { Pencil, Save } from 'lucide-react';
import Popover from '../ui/factory/Popover';
import { Button } from '../ui/button';

export default function HighlightPopover() {
  return (
    <Popover trigger={<Pencil />} withCloseButton={false}>
      <div className='flex flex-row items-center gap-1'>
        <Button>
          <Pencil />
        </Button>
        <Button>
          <Pencil />
        </Button>
        <Button>
          <Pencil />
        </Button>
        <Button>
          <Pencil />
        </Button>
      </div>
    </Popover>
  );
}

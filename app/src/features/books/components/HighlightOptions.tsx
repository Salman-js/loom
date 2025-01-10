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

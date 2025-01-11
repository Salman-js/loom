'use client';

import React from 'react';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverForm,
  PopoverLabel,
  PopoverTextarea,
  PopoverFooter,
  PopoverCloseButton,
  PopoverSubmitButton,
  PopoverHeader,
  PopoverBody,
} from '@/components/ui/popover';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
type PopoverProps = {
  title?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  trigger: React.ReactNode;
  withCloseButton?: boolean;
  className?: string;
};

const Popover: React.FC<PopoverProps> = ({
  children,
  footer,
  header,
  title,
  trigger,
  withCloseButton = true,
  className,
}) => {
  return (
    <PopoverRoot>
      <PopoverTrigger variant='link' size='icon'>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className={cn('', className)}>
        {title ||
          header ||
          (withCloseButton && (
            <PopoverHeader
              className={
                header
                  ? undefined
                  : `flex flex-row justify-${
                      title ? 'between' : 'end'
                    } items-center`
              }
            >
              {header ? header : title}
              {withCloseButton && <PopoverCloseButton />}
            </PopoverHeader>
          ))}
        {children}
        {footer && <PopoverFooter>{footer}</PopoverFooter>}
      </PopoverContent>
    </PopoverRoot>
  );
};
export default Popover;

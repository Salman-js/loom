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
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

const Popover: React.FC<PopoverProps> = ({
  children,
  footer,
  header,
  title,
  trigger,
  withCloseButton = true,
  className,
  disabled = false,
  size,
}) => {
  return (
    <PopoverRoot>
      <PopoverTrigger variant='ghost' size={size} disabled={disabled}>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className={cn('', className)}>
        {title ||
          header ||
          (withCloseButton && (
            <PopoverHeader
              className={cn(
                '',
                header
                  ? undefined
                  : `flex flex-row justify-${
                      title ? 'between' : 'end'
                    } items-center`
              )}
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

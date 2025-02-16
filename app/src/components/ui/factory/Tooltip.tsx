import {
  Tooltip as ToolTip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';
type tooltipProps = {
  children: React.ReactElement;
  content: string | React.ReactNode;
};
export const Tooltip: React.FC<tooltipProps> = ({ children, content }) => {
  return (
    <TooltipProvider>
      <ToolTip disableHoverableContent>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className='z-10'>{content}</TooltipContent>
      </ToolTip>
    </TooltipProvider>
  );
};

'use client';

import React, { useState } from 'react';
import { ITextSelection } from './reader/reader';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { Tooltip } from '@/components/ui/factory/Tooltip';

type CopyToClipBoardProps = {
  currentSelection?: ITextSelection | null;
  disabled?: boolean;
};

const CopyToClipBoard: React.FC<CopyToClipBoardProps> = ({
  currentSelection,
  disabled = false,
}) => {
  const text = currentSelection?.text;
  const [copied, setCopied] = useState(false);
  function onCopy() {
    if (text)
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
  }
  return (
    <Button
      size='icon'
      variant='ghost'
      onClick={onCopy}
      className='flex flex-col justify-center items-center'
      disabled={disabled}
    >
      <Copy
        className={`${
          copied ? 'scale-0' : 'scale-100'
        } transition-all duration-300`}
      />
      <Check
        className={`${
          copied ? 'scale-100' : 'scale-0'
        } absolute m-auto transition-all duration-300`}
      />
    </Button>
  );
};
export default CopyToClipBoard;

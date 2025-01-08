'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function BookDescription({
  description,
}: {
  description?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const descriptionContent = description ?? '';
  const truncatedDescription =
    descriptionContent.length > maxLength
      ? descriptionContent.substring(0, maxLength) + '...'
      : descriptionContent;

  return (
    <p className='text-lg text-foreground'>
      {isExpanded ? descriptionContent : truncatedDescription}
      {descriptionContent.length > maxLength && (
        <Button
          onClick={toggleContent}
          size='sm'
          variant='link'
          className='text-primary'
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </Button>
      )}
    </p>
  );
}

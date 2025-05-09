'use client';

import { SidebarMenuSub } from '@/components/ui/sidebar';
import { useReaderStyle } from '@/features/books/hooks/use-reader-style';
import { Check } from 'lucide-react';
import { useState } from 'react';

const colorOptions: {
  background: React.CSSProperties['color'];
  text: React.CSSProperties['color'];
}[] = [
  { background: '#18181b', text: '#fafafa' },
  { background: '#fafafa', text: '#18181b' },
  { background: '#4ade80', text: '#022c22' },
  { background: '#000000', text: '#ffffff' },
];

export default function ColorSelector() {
  const { background, text, setColorStyle } = useReaderStyle();

  const handleSelectColor = (color: {
    background: React.CSSProperties['color'];
    text: React.CSSProperties['color'];
  }) => {
    setColorStyle(color);
  };

  return (
    <SidebarMenuSub>
      <div className='w-full flex flex-col gap-2 py-2'>
        <div className='w-full flex flex-row gap-3'>
          {colorOptions.map((color) => (
            <div
              key={color.background} // Add a unique key
              className={`rounded-full p-2 flex justify-center items-center cursor-pointer ${
                background === color.background
                  ? 'border-2 border-primary'
                  : 'border border-foreground'
              }`}
              onClick={() => handleSelectColor(color)}
              style={{
                backgroundColor: color.background, // Use inline style for dynamic colors
              }}
            >
              <Check
                color={
                  background === color.background
                    ? color.text
                    : color.background
                }
                size={18}
              />
            </div>
          ))}
        </div>
      </div>
    </SidebarMenuSub>
  );
}

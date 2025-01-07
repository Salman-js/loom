import { Button } from '@/components/ui/button';
import { SidebarMenuSub } from '@/components/ui/sidebar';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const fontFamilies = [
  { name: 'Arial', style: 'font-arial' },
  { name: 'Times New Roman', style: 'font-times' },
  { name: 'Courier New', style: 'font-courier' },
  { name: 'Georgia', style: 'font-georgia' },
  { name: 'Verdana', style: 'font-verdana' },
];

export default function FontSelector() {
  const [selectedFont, setSelectedFont] = useState<{
    style: React.CSSProperties['fontFamily'];
    size: number;
  }>({
    style: fontFamilies[0].style,
    size: 16,
  });

  const handleFontSelect = (fontStyle: string) => {
    setSelectedFont({
      ...selectedFont,
      style: fontStyle,
    });
  };

  const handleIncreaseFontByOne = () => {
    setSelectedFont((prevFont) => ({ ...prevFont, size: prevFont.size + 1 }));
  };
  const handleDecreaseFontByOne = () => {
    setSelectedFont((prevFont) => ({ ...prevFont, size: prevFont.size - 1 }));
  };
  return (
    <SidebarMenuSub>
      <div className='w-full flex flex-col gap-2 py-2'>
        <p className='text-muted-foreground text-sm my-2'>Font Family</p>
        <div className='grid grid-cols-2 gap-1'>
          {fontFamilies.map((font) => (
            <div
              className={`rounded-lg flex flex-col justify-center items-center text-center p-1 cursor-pointer ${
                selectedFont.style === font.style
                  ? 'bg-foreground text-background'
                  : 'bg-background text-foreground'
              }`}
              onClick={() => handleFontSelect(font.style)}
            >
              <div style={{ fontFamily: font.style }} className='text-xl'>
                Aa
              </div>
              <div className='text-xs'>{font.name}</div>
            </div>
          ))}
        </div>
        <p className='text-muted-foreground text-sm my-2'>Font Size</p>
        <div className='w-full flex flex-row justify-between items-center'>
          <div className='flex'>
            <Button size='icon' onClick={handleDecreaseFontByOne}>
              <Minus />
            </Button>
          </div>
          <div className='flex text-xl'>{selectedFont.size}</div>
          <div className='flex'>
            <Button size='icon' onClick={handleIncreaseFontByOne}>
              <Plus />
            </Button>
          </div>
        </div>
      </div>
    </SidebarMenuSub>
  );
}

import { Button } from '@/components/ui/button';
import { SidebarMenuSub } from '@/components/ui/sidebar';
import { useReaderStyle } from '@/features/books/hooks/use-reader-style';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const fontFamilies = [
  {
    name: 'Arial',
    url: `url('https://fonts.cdnfonts.com/s/29107/ARIALMTEXTRABOLD.woff') format('woff')`,
    style: 'font-arial',
  },
  {
    name: 'Times New Roman',
    url: `url('https://fonts.cdnfonts.com/s/57197/times.woff') format('woff')`,
    style: 'font-times',
  },
  {
    name: 'Mechanical',
    url: `url('https://fonts.cdnfonts.com/s/20938/MechanicalObl.woff') format('woff')`,
    style: 'font-courier',
  },
  {
    name: 'Georgia',
    url: `url('https://fonts.cdnfonts.com/s/14416/GeorgiaPro-CondRegular.woff') format('woff')`,
    style: 'font-georgia',
  },
  {
    name: 'Verdana',
    url: `url('https://fonts.cdnfonts.com/s/26084/VERDANAI.woff') format('woff')`,
    style: 'font-verdana',
  },
];

export default function FontSelector() {
  const { fontFamily, fontSize, setFontFamily, setFontSize } = useReaderStyle();
  const [selectedFont, setSelectedFont] = useState<{
    style: React.CSSProperties['fontFamily'];
    size: number;
  }>({
    style: fontFamily,
    size: Number(fontSize || 0) ?? 16,
  });

  const handleFontSelect = (style: string, url: string) => {
    setSelectedFont({
      ...selectedFont,
      style: style,
    });
    setFontFamily(url);
  };

  const handleIncreaseFontByOne = () => {
    const newSize = selectedFont.size + 1;
    setSelectedFont((prevFont) => ({ ...prevFont, size: prevFont.size + 1 }));
    setFontSize(newSize);
  };
  const handleDecreaseFontByOne = () => {
    const newSize = selectedFont.size - 1;
    setSelectedFont((prevFont) => ({ ...prevFont, size: prevFont.size + 1 }));
    setFontSize(newSize);
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
              onClick={() => handleFontSelect(font.style, font.url)}
            >
              <div style={{ fontFamily: font.style }} className='text-xl'>
                Aa
              </div>
              <div className='text-xs' style={{ fontFamily: font.style }}>
                {font.name}
              </div>
            </div>
          ))}
        </div>
        <p className='text-muted-foreground text-sm my-2'>Font Size</p>
        <div className='w-full flex flex-row justify-between items-center'>
          <div className='flex'>
            <Button
              size='icon'
              variant='outline'
              onClick={handleDecreaseFontByOne}
            >
              <Minus />
            </Button>
          </div>
          <div className='flex text-xl'>{selectedFont.size}</div>
          <div className='flex'>
            <Button
              size='icon'
              variant='outline'
              onClick={handleIncreaseFontByOne}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>
    </SidebarMenuSub>
  );
}

import { clsx, type ClassValue } from 'clsx';
import ePub, { Book } from 'epubjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getCover(
  url: string | ArrayBuffer
): Promise<string | null> {
  try {
    console.log('Attempting to load book from URL:', url);
    const book = ePub(url);
    console.log('Book metadata:', book.packaging);
    const cover = await book.coverUrl();
    console.log('Cover:', cover);
    return cover || null;
  } catch (error) {
    console.error('Error fetching cover:', error);
    return null;
  }
}

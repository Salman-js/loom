import { clsx, type ClassValue } from 'clsx';
import ePub, { Book } from 'epubjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getMetaData(url: string | ArrayBuffer): Promise<{
  cover: string;
  title: string;
  author: string;
  publishDate: string;
  publisher: string;
} | null> {
  try {
    const book = ePub(url);
    const cover = await book.coverUrl();
    const metaData = await book.loaded.metadata;
    const title = metaData.title;
    const author = metaData.creator;
    const publishDate = metaData.pubdate;
    const publisher = metaData.publisher;
    return {
      cover: cover as string,
      title,
      author,
      publishDate,
      publisher,
    };
  } catch (error) {
    console.error('Error fetching cover:', error);
    return null;
  }
}

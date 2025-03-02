import { IShelf } from '@/features/shelves/interface/shelf.interface';
import { File } from 'buffer';

export interface IBook {
  id: string;
  author: string;
  title: string;
  cover?: string;
  description?: string;
  publishDate?: Date;
  genre: string;
  publisher?: string;
  path?: string;
  shelves: IShelf[];
  highlights: IHighlight[];
  notes: INote[];
}

export interface IHighlight {
  id: string;
  text: string;
  cfiRange: string;
  color: string;
  bookId: string;
}

export interface INote {
  id: string;
  text: string;
  cfiRange: string;
  note: string;
  bookId: string;
}

import { File } from 'buffer';

export interface IBook {
  id: number;
  author: string;
  title: string;
  image: string;
  description: string;
  content: string;
  epub?: File;
  cover?: string;
}

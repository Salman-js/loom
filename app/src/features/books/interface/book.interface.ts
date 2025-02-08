import { File } from 'buffer';

export interface IBook {
  id: number;
  author: string;
  title: string;
  cover?: string;
  description: string;
  content: string;
  path?: string;
}

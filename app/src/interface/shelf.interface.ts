import { IBook } from './book.interface';

export interface INewShelf {
  name: string;
  description?: string;
}

export interface IShelf extends INewShelf {
  id: number;
  books: IBook[];
}

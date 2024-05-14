import { IBook } from ".";

export interface ICollection {
  id: number;
  title: string;
  author: string;
  books: IBook[];
}

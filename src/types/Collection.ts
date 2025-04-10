import { IBook } from ".";

export interface ICollection {
  success?: boolean;
  message?: string;
  id: number;
  title: string;
  author: string;
  books: IBook[];
}

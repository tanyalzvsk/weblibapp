import { IBook } from ".";

export interface ICollection {
  success: any;
  message?: string;
  id: number;
  title: string;
  author: string;
  books: IBook[];
}

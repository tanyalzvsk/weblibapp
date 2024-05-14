import { IBook } from "./Book";
import { IUser } from "./User";

interface USI extends IUser {
  is_friend: boolean;
}

export interface ISearchData {
  users: USI[];
  books: IBook[];
  book_by_author: IBook[];
}

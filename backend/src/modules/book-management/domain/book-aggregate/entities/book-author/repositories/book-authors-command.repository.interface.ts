import { BookAuthor } from '../book-author.entity';

export interface IBookAuthorsCommandRepository {
  findOne(bookId: string, authorId: string): Promise<BookAuthor>;

  save(bookAuthor: BookAuthor): Promise<void>;

  delete(bookId: string, authorId: string): Promise<void>;
}

export const BOOK_AUTHORS_COMMAND_REPOSITORY = 'IBookAuthorsCommandRepository';

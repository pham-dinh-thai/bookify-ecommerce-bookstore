import { Book } from '../book.aggregate';

export interface IBooksCommandRepository {
  findOne(id: string): Promise<Book>;

  save(book: Book): Promise<void>;

  delete(id: string): Promise<void>;
}

export const BOOKS_COMMAND_REPOSITORY = 'IBooksCommandRepository';

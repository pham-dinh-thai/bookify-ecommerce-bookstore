import { Book } from '../book.aggregate';
import { BookCover } from '../entities/book-cover/book-cover.entity';

export interface IBooksCommandRepository {
  findOne(id: string): Promise<Book>;

  insert(book: Book): Promise<void>;

  update(book: Book): Promise<void>;

  updateQuantity(id: string, quantity: number): Promise<void>;

  updatePrice(id: string, price: number): Promise<void>;

  save(book: Book): Promise<void>;

  insertCover(bookId: string, cover: BookCover): Promise<void>;

  delete(id: string): Promise<void>;

  removeCover(bookId: string, coverId: string): Promise<void>;
}

export const BOOKS_COMMAND_REPOSITORY = 'IBooksCommandRepository';

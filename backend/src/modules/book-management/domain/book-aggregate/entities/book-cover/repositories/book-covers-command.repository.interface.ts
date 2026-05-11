import { BookCover } from '../book-cover.entity';

export interface IBookCoversCommandRepository {
  findOne(id: string): Promise<BookCover>;

  save(bookId: string, bookCover: BookCover): Promise<void>;

  delete(id: string): Promise<void>;
}

export const BOOK_COVERS_COMMAND_REPOSITORY = 'IBookCoversCommandRepository';

import { BookGenre } from '../book-genre.entity';

export interface IBookGenresCommandRepository {
  findOne(bookId: string, genreId: string): Promise<BookGenre>;

  save(bookGenre: BookGenre): Promise<void>;

  delete(bookId: string, genreId: string): Promise<void>;
}

export const BOOK_GENRES_COMMAND_REPOSITORY = 'IBookGenresCommandRepository';

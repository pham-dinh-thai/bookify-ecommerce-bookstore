import { BookGenre } from '../../domain/book-aggregate/entities/book-genre/book-genre.entity';
import { BookGenreTypeOrm } from '../entities/book-genre.entity';

export class BookGenresMapper {
  public static toDomain(bookGenreTypeOrm: BookGenreTypeOrm): BookGenre {
    return BookGenre.fromPersistent({
      bookId: bookGenreTypeOrm.bookId,
      genreId: bookGenreTypeOrm.genreId,
    });
  }

  public static toTypeOrm(bookGenre: BookGenre): BookGenreTypeOrm {
    const bookGenreTypeOrm = new BookGenreTypeOrm();

    bookGenreTypeOrm.bookId = bookGenre.getBookId();
    bookGenreTypeOrm.genreId = bookGenre.getGenreId();

    return bookGenreTypeOrm;
  }
}

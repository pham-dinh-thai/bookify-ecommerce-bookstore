import { BookAuthor } from '../../domain/book-aggregate/entities/book-author/book-author.entity';
import { BookAuthorTypeOrm } from '../entities/book-author.entity';

export class BookAuthorsMapper {
  public static toDomain(bookAuthorTypeOrm: BookAuthorTypeOrm): BookAuthor {
    return BookAuthor.fromPersistent({
      bookId: bookAuthorTypeOrm.bookId,
      authorId: bookAuthorTypeOrm.authorId,
    });
  }

  public static toTypeOrm(bookAuthor: BookAuthor): BookAuthorTypeOrm {
    const bookAuthorTypeOrm = new BookAuthorTypeOrm();

    bookAuthorTypeOrm.bookId = bookAuthor.getBookId();
    bookAuthorTypeOrm.authorId = bookAuthor.getAuthorId();

    return bookAuthorTypeOrm;
  }
}

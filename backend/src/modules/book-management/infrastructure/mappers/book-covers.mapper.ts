import { BookCover } from '../../domain/book-aggregate/entities/book-cover/book-cover.entity';
import { BookCoverTypeOrm } from '../entities/book-cover.entity';

export class BookCoversMapper {
  public static toDomain(bookCoverTypeOrm: BookCoverTypeOrm): BookCover {
    return BookCover.fromPersistent({
      id: bookCoverTypeOrm.id,
      url: bookCoverTypeOrm.url,
      isPrimary: bookCoverTypeOrm.isPrimary,
      displayOrder: bookCoverTypeOrm.displayOrder,
    });
  }

  public static toTypeOrm(
    bookId: string,
    bookCover: BookCover,
  ): BookCoverTypeOrm {
    const bookCoverTypeOrm = new BookCoverTypeOrm();

    bookCoverTypeOrm.id = bookCover.getId();
    bookCoverTypeOrm.bookId = bookId;
    bookCoverTypeOrm.url = bookCover.getUrl();
    bookCoverTypeOrm.isPrimary = bookCover.getIsPrimary();
    bookCoverTypeOrm.displayOrder = bookCover.getDisplayOrder();

    return bookCoverTypeOrm;
  }
}

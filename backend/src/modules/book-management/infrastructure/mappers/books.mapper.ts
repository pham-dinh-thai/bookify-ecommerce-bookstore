import { Book } from '../../domain/book-aggregate/book.aggregate';
import { BookReadModel } from '../../domain/book-aggregate/read-models/book.read-model';
import { BookTypeOrm } from '../entities/book.entity';
import { BookCoverTypeOrm } from '../entities/book-cover.entity';
import { BookAuthorTypeOrm } from '../entities/book-author.entity';
import { BookGenreTypeOrm } from '../entities/book-genre.entity';

export class BooksMapper {
  public static toDomain(bookTypeOrm: BookTypeOrm): Book {
    return Book.fromPersistent({
      id: bookTypeOrm.id,
      isbn: bookTypeOrm.isbn,
      title: bookTypeOrm.title,
      authorIds: bookTypeOrm.bookAuthors.map(
        (bookAuthor) => bookAuthor.authorId,
      ),
      publisherId: bookTypeOrm.publisherId,
      genreIds: bookTypeOrm.bookGenres.map((bookGenre) => bookGenre.genreId),
      description: bookTypeOrm.description,
      originalPrice: bookTypeOrm.originalPrice,
      discountPercentage: bookTypeOrm.discountPercentage,
      quantity: bookTypeOrm.quantity,
      bookCovers: (bookTypeOrm.covers ?? []).map((cover) => ({
        id: cover.id,
        url: cover.url,
        isPrimary: cover.isPrimary,
        displayOrder: cover.displayOrder,
      })),
      languageId: bookTypeOrm.languageId,
      pageCount: bookTypeOrm.pageCount,
    });
  }

  public static toTypeOrm(book: Book): BookTypeOrm {
    const bookTypeOrm = new BookTypeOrm();

    bookTypeOrm.id = book.getId();
    bookTypeOrm.isbn = book.getIsbn();
    bookTypeOrm.title = book.getTitle();
    bookTypeOrm.publisherId = book.getPublisherId();
    bookTypeOrm.description = book.getDescription();
    bookTypeOrm.originalPrice = book.getOriginalPrice();
    bookTypeOrm.discountPercentage = book.getDiscountPercentage();
    bookTypeOrm.quantity = book.getQuantity();
    bookTypeOrm.languageId = book.getLanguageId();
    bookTypeOrm.pageCount = book.getPageCount();

    return bookTypeOrm;
  }

  public static toReadModel(bookTypeOrm: BookTypeOrm): BookReadModel {
    return new BookReadModel(
      bookTypeOrm.id,
      bookTypeOrm.isbn,
      bookTypeOrm.title,
      bookTypeOrm.description,
      bookTypeOrm.originalPrice,
      bookTypeOrm.quantity,
      bookTypeOrm.pageCount,
      bookTypeOrm.quantity > 0,
      bookTypeOrm.language.name,
      bookTypeOrm.publisher.name,
      bookTypeOrm.bookAuthors.map(
        (bookAuthorTypeOrm) => bookAuthorTypeOrm.author.name,
      ),
      bookTypeOrm.bookGenres.map(
        (bookGenreTypeOrm) => bookGenreTypeOrm.genre.name,
      ),
      (bookTypeOrm.covers ?? []).map((bookCoverTypeOrm) => ({
        id: bookCoverTypeOrm.id,
        url: bookCoverTypeOrm.url,
        isPrimary: bookCoverTypeOrm.isPrimary,
        displayOrder: bookCoverTypeOrm.displayOrder,
      })),
    );
  }
}

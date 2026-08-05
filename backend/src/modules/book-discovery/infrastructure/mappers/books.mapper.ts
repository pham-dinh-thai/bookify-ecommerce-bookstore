import { Book } from '../../domain/book.aggregate';
import { BookAuthor } from '../../domain/entities/book-author.entity';
import { BookCover } from '../../domain/entities/book-cover.entity';
import { BookGenre } from '../../domain/entities/book-genre.entity';
import { BookReadModel } from '../../domain/read-models/book.read-model';
import { BookTypeOrm } from '../../../book-management/infrastructure/entities/book.entity';

export class BooksMapper {
  public static toDomain(bookTypeOrm: BookTypeOrm): Book {
    return Book.fromPersistent({
      id: bookTypeOrm.id,
      title: bookTypeOrm.title,
      publisher: bookTypeOrm.publisher.name,
      authors: (bookTypeOrm.bookAuthors ?? []).map((bookAuthorTypeOrm) =>
        BookAuthor.fromPersistent({
          name: bookAuthorTypeOrm.author.name,
        }),
      ),
      originalPrice: Number(bookTypeOrm.originalPrice),
      discountPercentage: Number(bookTypeOrm.discountPercentage || 0),
      quantity: bookTypeOrm.quantity,
      genres: (bookTypeOrm.bookGenres ?? []).map((bookGenreTypeOrm) =>
        BookGenre.fromPersistent({
          id: bookGenreTypeOrm.genre.id,
          name: bookGenreTypeOrm.genre.name,
        }),
      ),
      covers: (bookTypeOrm.covers ?? []).map((bookCoverTypeOrm) =>
        BookCover.fromPersistent({
          url: bookCoverTypeOrm.url,
          isPrimary: bookCoverTypeOrm.isPrimary,
        }),
      ),
    });
  }

  public static toReadModel(book: Book): BookReadModel {
    return new BookReadModel(
      book.getId(),
      book.getTitle(),
      book.getPublisher(),
      book.getAuthors().map((author) => author.getName()),
      book.getOriginalPrice(),
      book.getDiscountPercentage(),
      book.getCurrentPrice(),
      book.isOnSale(),
      book.getQuantity(),
      book.isInStock(),
      book.getGenres().map((genre) => genre.getName()),
      book.getCovers().map((cover) => ({
        url: cover.getUrl(),
        isPrimary: cover.isPrimaryCover(),
      })),
    );
  }
}

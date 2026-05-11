import { BookReadModel } from '../../domain/book-aggregate/read-models/book.read-model';
import { BookTypeOrm } from '../entities/book.entity';

export class BooksMapper {
  public static toReadModel(bookTypeOrm: BookTypeOrm): BookReadModel {
    return new BookReadModel(
      bookTypeOrm.id,
      bookTypeOrm.isbn,
      bookTypeOrm.title,
      bookTypeOrm.description,
      bookTypeOrm.originalPrice,
      bookTypeOrm.quantity,
      bookTypeOrm.languageId,
      bookTypeOrm.pageCount,
    );
  }
}

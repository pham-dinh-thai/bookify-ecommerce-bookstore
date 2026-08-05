import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookIsbnEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Book ISBN is required', 'BOOK_ISBN_EMPTY');
  }
}

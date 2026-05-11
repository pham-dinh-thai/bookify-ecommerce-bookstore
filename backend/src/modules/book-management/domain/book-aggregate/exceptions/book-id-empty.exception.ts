import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class BookIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Book id is required', 'BOOK_ID_EMPTY');
  }
}

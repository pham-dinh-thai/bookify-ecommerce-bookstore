import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class BookCoverIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Book cover ID is required', 'BOOK_COVER_ID_EMPTY');
  }
}

import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class BookCoverUrlEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Book cover URL is required', 'BOOK_COVER_URL_EMPTY');
  }
}

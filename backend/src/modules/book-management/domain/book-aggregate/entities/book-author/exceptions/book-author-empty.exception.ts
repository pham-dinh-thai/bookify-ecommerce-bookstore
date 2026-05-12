import { BadRequestDomainException } from '../../../../../../../shared/domain/exception/domain.exception';

export class BookAuthorEmptyException extends BadRequestDomainException {
  public constructor() {
    super('At least one author is required', 'BOOK_AUTHOR_EMPTY');
  }
}

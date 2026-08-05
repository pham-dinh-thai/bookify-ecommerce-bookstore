import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookTitleEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Book title is required', 'BOOK_TITLE_EMPTY');
  }
}

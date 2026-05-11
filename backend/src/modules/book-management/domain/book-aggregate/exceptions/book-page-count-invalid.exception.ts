import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class BookPageCountInvalidException extends BadRequestDomainException {
  constructor() {
    super('Page count must be greater than zero', 'BOOK_PAGE_COUNT_INVALID');
  }
}

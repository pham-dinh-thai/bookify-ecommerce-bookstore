import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookQuantityEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Book quantity is required', 'BOOK_QUANTITY_EMPTY');
  }
}

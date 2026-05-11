import { UnprocessableEntityDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class BookQuantityInsufficientException extends UnprocessableEntityDomainException {
  public constructor() {
    super('Book quantity is insufficient', 'BOOK_QUANTITY_INSUFFICIENT');
  }
}

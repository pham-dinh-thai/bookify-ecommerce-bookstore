import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookQuantityNegativeException extends BadRequestDomainException {
  public constructor() {
    super('Book quantity cannot be negative', 'BOOK_QUANTITY_NEGATIVE');
  }
}

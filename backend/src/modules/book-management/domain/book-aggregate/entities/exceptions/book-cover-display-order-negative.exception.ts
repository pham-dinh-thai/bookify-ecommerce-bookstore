import { BadRequestDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class BookCoverDisplayOrderNegativeException extends BadRequestDomainException {
  public constructor() {
    super(
      'Book cover display order cannot be negative',
      'BOOK_COVER_DISPLAY_ORDER_NEGATIVE',
    );
  }
}

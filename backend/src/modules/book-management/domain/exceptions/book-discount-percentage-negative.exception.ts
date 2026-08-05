import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookDiscountPercentageNegativeException extends BadRequestDomainException {
  public constructor() {
    super(
      'Book discount percentage cannot be negative',
      'BOOK_DISCOUNT_PERCENTAGE_NEGATIVE',
    );
  }
}

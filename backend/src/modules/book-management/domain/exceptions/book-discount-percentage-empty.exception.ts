import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookDiscountPercentageEmptyException extends BadRequestDomainException {
  public constructor() {
    super(
      'Book discount percentage is required',
      'BOOK_DISCOUNT_PERCENTAGE_EMPTY',
    );
  }
}

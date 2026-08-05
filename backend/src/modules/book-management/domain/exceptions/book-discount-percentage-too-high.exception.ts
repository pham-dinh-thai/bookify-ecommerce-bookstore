import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookDiscountPercentageTooHighException extends BadRequestDomainException {
  public constructor() {
    super(
      'Book discount percentage cannot be greater than 100',
      'BOOK_DISCOUNT_PERCENTAGE_TOO_HIGH',
    );
  }
}

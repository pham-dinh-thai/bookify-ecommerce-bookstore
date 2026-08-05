import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookPriceLessOrEqualZeroException extends BadRequestDomainException {
  public constructor() {
    super(
      'Book price must be greater than zero',
      'BOOK_PRICE_LESS_OR_EQUAL_ZERO',
    );
  }
}

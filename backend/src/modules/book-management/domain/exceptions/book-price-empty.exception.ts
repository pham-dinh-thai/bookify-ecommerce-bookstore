import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookPriceEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Book price is required', 'BOOK_PRICE_EMPTY');
  }
}

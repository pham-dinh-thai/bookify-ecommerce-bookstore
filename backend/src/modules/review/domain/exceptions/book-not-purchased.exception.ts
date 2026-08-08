import { ForbiddenDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookNotPurchasedException extends ForbiddenDomainException {
  public constructor() {
    super(
      'You must purchase this book before reviewing it',
      'BOOK_NOT_PURCHASED',
    );
  }
}

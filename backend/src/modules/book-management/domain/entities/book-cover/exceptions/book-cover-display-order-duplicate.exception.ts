import { ConflictDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class BookCoverDisplayOrderDuplicateException extends ConflictDomainException {
  public constructor() {
    super(
      'Book cover display order must be unique per book',
      'BOOK_COVER_DISPLAY_ORDER_DUPLICATE',
    );
  }
}

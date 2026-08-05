import { NotFoundDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class BookCoverNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Book cover not found', 'BOOK_COVER_NOT_FOUND');
  }
}

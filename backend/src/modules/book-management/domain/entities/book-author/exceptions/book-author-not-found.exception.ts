import { NotFoundDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class BookAuthorNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Book author not found', 'BOOK_AUTHOR_NOT_FOUND');
  }
}

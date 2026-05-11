import { NotFoundDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class BookNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Book is not found', 'BOOK_NOT_FOUND');
  }
}

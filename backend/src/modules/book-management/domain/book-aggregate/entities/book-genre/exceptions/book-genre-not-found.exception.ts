import { NotFoundDomainException } from '../../../../../../../shared/domain/exception/domain.exception';

export class BookGenreNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Book genre not found', 'BOOK_GENRE_NOT_FOUND');
  }
}

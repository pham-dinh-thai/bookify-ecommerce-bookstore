import { BadRequestDomainException } from '../../../../../shared/domain/exception/domain.exception';

export class BookGenreEmptyException extends BadRequestDomainException {
  public constructor() {
    super('At least one genre is required', 'BOOK_GENRE_EMPTY');
  }
}

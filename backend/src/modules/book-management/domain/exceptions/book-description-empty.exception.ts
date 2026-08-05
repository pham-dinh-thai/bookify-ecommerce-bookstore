import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookDescriptionEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Book description is required', 'BOOK_DESCRIPTION_EMPTY');
  }
}

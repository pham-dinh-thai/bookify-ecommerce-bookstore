import { ConflictDomainException } from '../../../../shared/domain/exception/domain.exception';

export class BookIsbnDuplicateException extends ConflictDomainException {
  public constructor() {
    super('Book isbn can not be duplicate', 'BOOK_ISBN_DUPLICATE');
  }
}

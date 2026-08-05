import { ConflictDomainException } from '../../../../../../shared/domain/exception/domain.exception';

export class BookCoverPrimaryDuplicateException extends ConflictDomainException {
  public constructor() {
    super('A book already has a primary cover', 'BOOK_COVER_PRIMARY_DUPLICATE');
  }
}

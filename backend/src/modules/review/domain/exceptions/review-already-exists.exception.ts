import { ConflictDomainException } from '../../../../shared/domain/exception/domain.exception';

export class ReviewAlreadyExistsException extends ConflictDomainException {
  public constructor() {
    super('You have already reviewed this book', 'REVIEW_ALREADY_EXISTS');
  }
}

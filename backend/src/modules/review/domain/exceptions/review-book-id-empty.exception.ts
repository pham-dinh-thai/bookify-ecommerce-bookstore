import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class ReviewBookIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Review book id can not be empty', 'REVIEW_BOOK_ID_EMPTY');
  }
}

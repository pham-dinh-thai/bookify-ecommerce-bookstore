import { NotFoundDomainException } from '../../../../shared/domain/exception/domain.exception';

export class ReviewNotFoundException extends NotFoundDomainException {
  public constructor() {
    super('Review not found', 'REVIEW_NOT_FOUND');
  }
}

import { ForbiddenDomainException } from '../../../../shared/domain/exception/domain.exception';

export class ReviewNotOwnedException extends ForbiddenDomainException {
  public constructor() {
    super('You can only manage your own reviews', 'REVIEW_NOT_OWNED');
  }
}

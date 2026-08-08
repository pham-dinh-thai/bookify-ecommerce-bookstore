import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class ReviewUserIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Review user id can not be empty', 'REVIEW_USER_ID_EMPTY');
  }
}

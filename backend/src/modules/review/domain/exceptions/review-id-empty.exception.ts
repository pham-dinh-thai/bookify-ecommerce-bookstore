import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class ReviewIdEmptyException extends BadRequestDomainException {
  public constructor() {
    super('Review id can not be empty', 'REVIEW_ID_EMPTY');
  }
}

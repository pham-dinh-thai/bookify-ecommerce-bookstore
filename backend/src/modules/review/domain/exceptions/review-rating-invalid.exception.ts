import { BadRequestDomainException } from '../../../../shared/domain/exception/domain.exception';

export class ReviewRatingInvalidException extends BadRequestDomainException {
  public constructor() {
    super(
      'Review rating must be between 1.0 and 5.0 in 0.5 steps',
      'REVIEW_RATING_INVALID',
    );
  }
}

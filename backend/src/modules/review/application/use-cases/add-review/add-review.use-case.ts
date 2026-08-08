import { Inject, Injectable } from '@nestjs/common';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import { Review } from '../../../domain/review.aggregate';
import { BookNotPurchasedException } from '../../../domain/exceptions/book-not-purchased.exception';
import { ReviewAlreadyExistsException } from '../../../domain/exceptions/review-already-exists.exception';
import {
  type IReviewsCommandRepository,
  REVIEWS_COMMAND_REPOSITORY,
} from '../../../domain/repositories/reviews-command.repository.interface';
import {
  type IReviewsQueryRepository,
  REVIEWS_QUERY_REPOSITORY,
} from '../../../domain/repositories/reviews-query.repository.interface';
import {
  type IReviewPurchaseVerifier,
  REVIEW_PURCHASE_VERIFIER,
} from '../../../domain/services/review-purchase-verifier.service';
import { IAddReviewRequest } from './add-review.request';

@Injectable()
export class AddReviewUseCase {
  public constructor(
    @Inject(REVIEWS_COMMAND_REPOSITORY)
    private readonly reviewsCommandRepository: IReviewsCommandRepository,

    @Inject(REVIEWS_QUERY_REPOSITORY)
    private readonly reviewsQueryRepository: IReviewsQueryRepository,

    @Inject(REVIEW_PURCHASE_VERIFIER)
    private readonly reviewPurchaseVerifier: IReviewPurchaseVerifier,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    bookId: string,
    userId: string,
    request: IAddReviewRequest,
  ): Promise<void> {
    const hasPurchased = await this.reviewPurchaseVerifier.hasPurchased(
      userId,
      bookId,
    );

    if (!hasPurchased) {
      throw new BookNotPurchasedException();
    }

    const alreadyReviewed =
      await this.reviewsQueryRepository.existsByBookAndUser(bookId, userId);

    if (alreadyReviewed) {
      throw new ReviewAlreadyExistsException();
    }

    const review = Review.create({
      id: this.uuidGenerator.generate(),
      bookId,
      userId,
      rating: request.rating,
      comment: request.comment,
    });

    await this.reviewsCommandRepository.save(review);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { MyReviewReadModel } from '../../../domain/read-models/my-review.read-model';
import {
  type IReviewsQueryRepository,
  REVIEWS_QUERY_REPOSITORY,
} from '../../../domain/repositories/reviews-query.repository.interface';
import {
  type IReviewPurchaseVerifier,
  REVIEW_PURCHASE_VERIFIER,
} from '../../../domain/services/review-purchase-verifier.service';

@Injectable()
export class FindMyReviewUseCase {
  public constructor(
    @Inject(REVIEWS_QUERY_REPOSITORY)
    private readonly reviewsQueryRepository: IReviewsQueryRepository,

    @Inject(REVIEW_PURCHASE_VERIFIER)
    private readonly reviewPurchaseVerifier: IReviewPurchaseVerifier,
  ) {}

  public async execute(
    bookId: string,
    userId: string,
  ): Promise<MyReviewReadModel> {
    const hasPurchased = await this.reviewPurchaseVerifier.hasPurchased(
      userId,
      bookId,
    );

    if (!hasPurchased) {
      return new MyReviewReadModel(false, null);
    }

    const review = await this.reviewsQueryRepository.findByBookAndUser(
      bookId,
      userId,
    );

    return new MyReviewReadModel(true, review);
  }
}

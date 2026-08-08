import { Inject, Injectable } from '@nestjs/common';
import { ReviewNotFoundException } from '../../../domain/exceptions/review-not-found.exception';
import { ReviewNotOwnedException } from '../../../domain/exceptions/review-not-owned.exception';
import {
  type IReviewsCommandRepository,
  REVIEWS_COMMAND_REPOSITORY,
} from '../../../domain/repositories/reviews-command.repository.interface';
import {
  type IReviewsQueryRepository,
  REVIEWS_QUERY_REPOSITORY,
} from '../../../domain/repositories/reviews-query.repository.interface';

@Injectable()
export class DeleteReviewUseCase {
  public constructor(
    @Inject(REVIEWS_QUERY_REPOSITORY)
    private readonly reviewsQueryRepository: IReviewsQueryRepository,

    @Inject(REVIEWS_COMMAND_REPOSITORY)
    private readonly reviewsCommandRepository: IReviewsCommandRepository,
  ) {}

  public async execute(
    bookId: string,
    reviewId: string,
    userId: string,
  ): Promise<void> {
    const reviewReadModel =
      await this.reviewsQueryRepository.findById(reviewId);

    if (!reviewReadModel || reviewReadModel.bookId !== bookId) {
      throw new ReviewNotFoundException();
    }

    if (reviewReadModel.userId !== userId) {
      throw new ReviewNotOwnedException();
    }

    await this.reviewsCommandRepository.delete(reviewId);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { BookReviewsReadModel } from '../../../domain/read-models/book-reviews.read-model';
import {
  type IReviewsQueryRepository,
  REVIEWS_QUERY_REPOSITORY,
} from '../../../domain/repositories/reviews-query.repository.interface';

@Injectable()
export class FindBookReviewsUseCase {
  public constructor(
    @Inject(REVIEWS_QUERY_REPOSITORY)
    private readonly reviewsQueryRepository: IReviewsQueryRepository,
  ) {}

  public async execute(bookId: string): Promise<BookReviewsReadModel> {
    const reviews = await this.reviewsQueryRepository.findByBook(bookId);

    const reviewCount = reviews.length;
    const averageRating =
      reviewCount === 0
        ? null
        : Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviewCount
            ).toFixed(1),
          );

    return new BookReviewsReadModel(reviews, averageRating, reviewCount);
  }
}

import { Review } from '../review.aggregate';

export interface IReviewsCommandRepository {
  save(review: Review): Promise<void>;

  delete(reviewId: string): Promise<void>;
}

export const REVIEWS_COMMAND_REPOSITORY = 'IReviewsCommandRepository';

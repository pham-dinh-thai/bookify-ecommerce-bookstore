import { Review } from '../review.aggregate';

export interface IReviewsCommandRepository {
  save(review: Review): Promise<void>;
}

export const REVIEWS_COMMAND_REPOSITORY = 'IReviewsCommandRepository';

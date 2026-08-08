import { ReviewReadModel } from '../read-models/review.read-model';

export interface IReviewsQueryRepository {
  findByBook(bookId: string): Promise<ReviewReadModel[]>;

  findByBookAndUser(
    bookId: string,
    userId: string,
  ): Promise<ReviewReadModel | null>;

  existsByBookAndUser(bookId: string, userId: string): Promise<boolean>;
}

export const REVIEWS_QUERY_REPOSITORY = 'IReviewsQueryRepository';

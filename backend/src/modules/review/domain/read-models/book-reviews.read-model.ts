import { ReviewReadModel } from './review.read-model';

export class BookReviewsReadModel {
  public constructor(
    public readonly reviews: ReviewReadModel[],
    public readonly averageRating: number | null,
    public readonly reviewCount: number,
  ) {}
}

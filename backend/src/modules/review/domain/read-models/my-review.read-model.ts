import { ReviewReadModel } from './review.read-model';

export class MyReviewReadModel {
  public constructor(
    public readonly hasPurchased: boolean,
    public readonly review: ReviewReadModel | null,
  ) {}
}

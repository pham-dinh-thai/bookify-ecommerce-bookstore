import { ReviewRatingInvalidException } from '../exceptions/review-rating-invalid.exception';

export class ReviewRating {
  private constructor(private readonly value: number) {
    const scaled = Math.round(this.value * 10);

    if (scaled < 10 || scaled > 50 || scaled % 5 !== 0) {
      throw new ReviewRatingInvalidException();
    }
  }

  public static create(rating: number): ReviewRating {
    return new ReviewRating(rating);
  }

  public getValue(): number {
    return this.value;
  }
}
